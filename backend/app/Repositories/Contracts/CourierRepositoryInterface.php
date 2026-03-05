<?php

namespace App\Repositories\Contracts;

use App\Models\Courier;
use Illuminate\Database\Eloquent\Collection;

interface CourierRepositoryInterface
{
    public function getActive(): Collection;
    
    public function findById(int $id): ?Courier;
    
    public function getActiveCount(): int;
}
