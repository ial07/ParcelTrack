<?php

namespace App\Repositories\Contracts;

use App\Models\Warehouse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface WarehouseRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;
    
    public function getActive(): Collection;
    
    public function findById(int $id): ?Warehouse;
    
    public function create(array $data): Warehouse;
    
    public function update(Warehouse $warehouse, array $data): Warehouse;
    
    public function delete(Warehouse $warehouse): bool;
    
    public function getCountMetrics(): array;
}
