<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\CourierRepositoryInterface;
use Illuminate\Http\JsonResponse;

class CourierController extends Controller
{
    public function __construct(
        protected CourierRepositoryInterface $courierRepository
    ) {}

    public function index(): JsonResponse
    {
        $couriers = $this->courierRepository->getActive();

        return response()->json([
            'success' => true,
            'data' => $couriers,
        ]);
    }
}
