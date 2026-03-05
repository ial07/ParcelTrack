<?php

namespace App\Services;

use App\Enums\ParcelStatus;
use App\Models\Parcel;
use App\Models\User;
use App\Repositories\Contracts\ParcelRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class ParcelService
{
    /**
     * Define the valid next states for each parcel status.
     * Based on PRD rules.
     */
    protected const VALID_TRANSITIONS = [
        ParcelStatus::PENDING->value => [
            ParcelStatus::PICKED_UP->value,
            ParcelStatus::CANCELLED->value,
        ],
        ParcelStatus::PICKED_UP->value => [
            ParcelStatus::IN_WAREHOUSE->value,
            ParcelStatus::CANCELLED->value,
        ],
        ParcelStatus::IN_WAREHOUSE->value => [
            ParcelStatus::IN_TRANSIT->value,
            ParcelStatus::CANCELLED->value,
        ],
        ParcelStatus::IN_TRANSIT->value => [
            ParcelStatus::OUT_FOR_DELIVERY->value,
            ParcelStatus::IN_WAREHOUSE->value, // Transfer between warehouses
            ParcelStatus::CANCELLED->value,
        ],
        ParcelStatus::OUT_FOR_DELIVERY->value => [
            ParcelStatus::DELIVERED->value,
            ParcelStatus::RETURNED->value,
            ParcelStatus::CANCELLED->value,
        ],
        ParcelStatus::DELIVERED->value => [], // Terminal state
        ParcelStatus::RETURNED->value => [
            ParcelStatus::CANCELLED->value,
        ],
        ParcelStatus::CANCELLED->value => [], // Terminal state
    ];

    public function __construct(
        protected ParcelRepositoryInterface $parcelRepository
    ) {}

    public function createParcel(array $data, ?User $creator = null): Parcel
    {
        return DB::transaction(function () use ($data, $creator) {
            $data['tracking_number'] = $this->generateTrackingNumber();
            $data['current_status'] = ParcelStatus::PENDING->value;

            $parcel = $this->parcelRepository->create($data);

            $this->logStatusHistory(
                parcel: $parcel,
                status: ParcelStatus::PENDING->value,
                location: 'System Origin',
                notes: 'Parcel registered in system',
                changedBy: $creator
            );

            return $parcel;
        });
    }

    public function updateParcelStatus(Parcel $parcel, string $newStatus, ?string $location = null, ?string $notes = null, ?User $changedBy = null): Parcel
    {
        if (!$this->isValidTransition($parcel->current_status->value, $newStatus)) {
            throw new InvalidArgumentException("Invalid status transition from {$parcel->current_status->value} to {$newStatus}");
        }

        return DB::transaction(function () use ($parcel, $newStatus, $location, $notes, $changedBy) {
            $updatedParcel = $this->parcelRepository->updateStatus($parcel, $newStatus);

            $this->logStatusHistory(
                parcel: $updatedParcel,
                status: $newStatus,
                location: $location,
                notes: $notes,
                changedBy: $changedBy
            );

            return $updatedParcel;
        });
    }

    protected function isValidTransition(string $currentStatus, string $newStatus): bool
    {
        if ($currentStatus === $newStatus) {
            return true; // No actual transition needed
        }

        $validNextStates = self::VALID_TRANSITIONS[$currentStatus] ?? [];
        return in_array($newStatus, $validNextStates, true);
    }

    protected function generateTrackingNumber(): string
    {
        do {
            $trackingNumber = 'PT-' . strtoupper(Str::random(8));
            $exists = DB::table('parcels')->where('tracking_number', $trackingNumber)->exists();
        } while ($exists);

        return $trackingNumber;
    }

    protected function logStatusHistory(Parcel $parcel, string $status, ?string $location, ?string $notes, ?User $changedBy): void
    {
        $this->parcelRepository->addStatusHistory($parcel, [
            'status' => $status,
            'location' => $location,
            'notes' => $notes,
            'changed_by' => $changedBy?->id,
        ]);
    }
}
