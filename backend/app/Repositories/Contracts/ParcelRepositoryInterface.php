<?php

namespace App\Repositories\Contracts;

use App\Models\Parcel;
use Illuminate\Pagination\LengthAwarePaginator;

interface ParcelRepositoryInterface
{
    public function getAllPaginated(array $filters = [], string $sort = '-created_at', int $perPage = 15): LengthAwarePaginator;
    
    public function findById(int $id): ?Parcel;
    
    public function findByTrackingNumber(string $trackingNumber): ?Parcel;
    
    public function create(array $data): Parcel;
    
    public function update(Parcel $parcel, array $data): Parcel;
    
    public function updateStatus(Parcel $parcel, string $status): Parcel;
    
    public function addStatusHistory(Parcel $parcel, array $historyData): void;
    
    public function getStatusMetrics(): array;
}
