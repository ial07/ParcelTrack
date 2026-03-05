<?php

namespace App\Repositories;

use App\Models\Parcel;
use App\Repositories\Contracts\ParcelRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Database\Eloquent\Builder;

class ParcelRepository implements ParcelRepositoryInterface
{
    public function getAllPaginated(array $filters = [], string $sort = '-created_at', int $perPage = 15): LengthAwarePaginator
    {
        return QueryBuilder::for(Parcel::class)
            ->allowedFilters([
                'current_status',
                'origin_warehouse_id',
                'destination_warehouse_id',
                AllowedFilter::callback('created_at_from', function (Builder $query, $value) {
                    $query->whereDate('created_at', '>=', $value);
                }),
                AllowedFilter::callback('created_at_to', function (Builder $query, $value) {
                    $query->whereDate('created_at', '<=', $value);
                }),
            ])
            ->allowedSorts(['created_at', 'tracking_number', 'current_status'])
            ->defaultSort('-created_at')
            ->with(['originWarehouse:id,name,city,code', 'destinationWarehouse:id,name,city,code', 'courier:id,name,vehicle_type'])
            ->paginate($perPage);
    }
    
    public function findById(int $id): ?Parcel
    {
        return Parcel::with([
            'originWarehouse', 
            'destinationWarehouse', 
            'courier',
            'statusHistories' => function($query) {
                $query->orderBy('created_at', 'desc');
            },
            'statusHistories.changedBy:id,name'
        ])->find($id);
    }
    
    public function findByTrackingNumber(string $trackingNumber): ?Parcel
    {
        return Parcel::with([
            'originWarehouse', 
            'destinationWarehouse', 
            'courier',
            'statusHistories' => function($query) {
                $query->orderBy('created_at', 'desc');
            }
        ])->where('tracking_number', $trackingNumber)->first();
    }
    
    public function create(array $data): Parcel
    {
        return Parcel::create($data);
    }
    
    public function update(Parcel $parcel, array $data): Parcel
    {
        $parcel->update($data);
        return $parcel;
    }
    
    public function updateStatus(Parcel $parcel, string $status): Parcel
    {
        $parcel->update(['current_status' => $status]);
        return $parcel;
    }
    
    public function addStatusHistory(Parcel $parcel, array $historyData): void
    {
        $parcel->statusHistories()->create($historyData);
    }
    
    public function getStatusMetrics(): array
    {
        $total = Parcel::count();
        $inTransit = Parcel::where('current_status', 'IN_TRANSIT')->count();
        $delivered = Parcel::where('current_status', 'DELIVERED')->count();
        $pending = Parcel::where('current_status', 'PENDING')->count();
        
        return [
            'total' => $total,
            'in_transit' => $inTransit,
            'delivered' => $delivered,
            'pending_pickup' => $pending,
        ];
    }
}
