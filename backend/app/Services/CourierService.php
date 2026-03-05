<?php

namespace App\Services;

use App\Repositories\Contracts\CourierRepositoryInterface;

class CourierService
{
    public function __construct(
        protected CourierRepositoryInterface $courierRepository
    ) {}
}
