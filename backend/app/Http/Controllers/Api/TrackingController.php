<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrackingService;
use Illuminate\Http\JsonResponse;

class TrackingController extends Controller
{
    public function __construct(
        protected TrackingService $trackingService
    ) {}

    public function track(string $trackingNumber): JsonResponse
    {
        $parcel = $this->trackingService->track($trackingNumber);

        if (!$parcel) {
            return response()->json([
                'success' => false,
                'message' => 'Parcel not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $parcel,
        ]);
    }
}
