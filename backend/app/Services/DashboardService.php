<?php

namespace App\Services;

use App\Repositories\Contracts\ParcelRepositoryInterface;
use App\Repositories\Contracts\WarehouseRepositoryInterface;
use App\Repositories\Contracts\CourierRepositoryInterface;

class DashboardService
{
    public function __construct(
        protected ParcelRepositoryInterface $parcelRepository,
        protected WarehouseRepositoryInterface $warehouseRepository,
        protected CourierRepositoryInterface $courierRepository
    ) {}

    public function getMetrics(): array
    {
        $parcelMetrics = $this->parcelRepository->getStatusMetrics();
        $warehouseMetrics = $this->warehouseRepository->getCountMetrics();
        $activeCouriers = $this->courierRepository->getActiveCount();

        return [
            'parcels' => $parcelMetrics,
            'warehouses' => $warehouseMetrics,
            'couriers' => [
                'active' => $activeCouriers,
            ],
            'recent_parcels' => $this->parcelRepository->getAllPaginated([], '-created_at', 10)->items(),
        ];
    }
}
