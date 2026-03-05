<?php

namespace App\Repositories;

use App\Models\Warehouse;
use App\Models\Parcel;
use App\Repositories\Contracts\WarehouseRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class WarehouseRepository implements WarehouseRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return Warehouse::query()
            ->orderBy('name')
            ->paginate($perPage);
    }
    
    public function getActive(): Collection
    {
        return Warehouse::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }
    
    public function findById(int $id): ?Warehouse
    {
        return Warehouse::find($id);
    }
    
    public function create(array $data): Warehouse
    {
        return Warehouse::create($data);
    }
    
    public function update(Warehouse $warehouse, array $data): Warehouse
    {
        $warehouse->update($data);
        return $warehouse;
    }
    
    public function delete(Warehouse $warehouse): bool
    {
        return $warehouse->delete();
    }
    
    public function getCountMetrics(): array
    {
        $total = Warehouse::count();
        $active = Warehouse::where('is_active', true)->count();
        
        return [
            'total' => $total,
            'active' => $active,
            'inactive' => $total - $active,
        ];
    }
}
