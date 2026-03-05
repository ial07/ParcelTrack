<?php

namespace App\Services;

use App\Repositories\Contracts\WarehouseRepositoryInterface;
use App\Models\Warehouse;

class WarehouseService
{
    public function __construct(
        protected WarehouseRepositoryInterface $warehouseRepository
    ) {}

    public function createWarehouse(array $data): Warehouse
    {
        return $this->warehouseRepository->create($data);
    }

    public function updateWarehouse(Warehouse $warehouse, array $data): Warehouse
    {
        return $this->warehouseRepository->update($warehouse, $data);
    }

    public function updateStatus(Warehouse $warehouse, bool $isActive): Warehouse
    {
        return $this->warehouseRepository->update($warehouse, ['is_active' => $isActive]);
    }
}
