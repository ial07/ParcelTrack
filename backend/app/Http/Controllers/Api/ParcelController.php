<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parcel\StoreParcelRequest;
use App\Http\Requests\Parcel\UpdateParcelStatusRequest;
use App\Repositories\Contracts\ParcelRepositoryInterface;
use App\Services\ParcelService;
use Illuminate\Http\JsonResponse;

class ParcelController extends Controller
{
    public function __construct(
        protected ParcelRepositoryInterface $parcelRepository,
        protected ParcelService $parcelService
    ) {}

    public function index(): JsonResponse
    {
        $perPage = request()->get('per_page', 15);
        $parcels = $this->parcelRepository->getAllPaginated([], '-created_at', $perPage);

        return response()->json([
            'success' => true,
            'data' => $parcels,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $parcel = $this->parcelRepository->findById($id);

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

    public function store(StoreParcelRequest $request): JsonResponse
    {
        $parcel = $this->parcelService->createParcel($request->validated(), $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Parcel created successfully',
            'data' => $parcel,
        ], 201);
    }

    public function updateStatus(UpdateParcelStatusRequest $request, int $id): JsonResponse
    {
        $parcel = $this->parcelRepository->findById($id);

        if (!$parcel) {
            return response()->json([
                'success' => false,
                'message' => 'Parcel not found',
            ], 404);
        }

        try {
            $validated = $request->validated();
            $updatedParcel = $this->parcelService->updateParcelStatus(
                $parcel,
                $validated['status'],
                $validated['location'] ?? null,
                $validated['notes'] ?? null,
                $request->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Parcel status updated successfully',
                'data' => $updatedParcel,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
