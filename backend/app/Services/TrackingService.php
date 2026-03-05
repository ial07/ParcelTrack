<?php

namespace App\Services;

use App\Repositories\Contracts\ParcelRepositoryInterface;

class TrackingService
{
    public function __construct(
        protected ParcelRepositoryInterface $parcelRepository
    ) {}

    public function track(string $trackingNumber)
    {
        return $this->parcelRepository->findByTrackingNumber($trackingNumber);
    }
}
