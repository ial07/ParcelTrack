<?php

namespace App\Repositories;

use App\Models\Courier;
use App\Repositories\Contracts\CourierRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CourierRepository implements CourierRepositoryInterface
{
    public function getActive(): Collection
    {
        return Courier::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }
    
    public function findById(int $id): ?Courier
    {
        return Courier::find($id);
    }
    
    public function getActiveCount(): int
    {
        return Courier::where('is_active', true)->count();
    }
}
