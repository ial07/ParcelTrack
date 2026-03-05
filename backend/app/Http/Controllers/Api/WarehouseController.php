<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warehouse\StoreWarehouseRequest;
use App\Http\Requests\Warehouse\UpdateWarehouseRequest;
use App\Repositories\Contracts\WarehouseRepositoryInterface;
use App\Services\WarehouseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function __construct(
        protected WarehouseRepositoryInterface $warehouseRepository,
        protected WarehouseService $warehouseService
    ) {}

    public function index(): JsonResponse
    {
        $perPage = request()->get('per_page', 15);
        $warehouses = $this->warehouseRepository->getAllPaginated($perPage);

        return response()->json([
            'success' => true,
            'data' => $warehouses,
        ]);
    }

    public function store(StoreWarehouseRequest $request): JsonResponse
    {
        $warehouse = $this->warehouseService->createWarehouse($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Warehouse created successfully',
            'data' => $warehouse,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $warehouse = $this->warehouseRepository->findById($id);

        if (!$warehouse) {
            return response()->json([
                'success' => false,
                'message' => 'Warehouse not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $warehouse,
        ]);
    }

    public function update(UpdateWarehouseRequest $request, int $id): JsonResponse
    {
        $warehouse = $this->warehouseRepository->findById($id);

        if (!$warehouse) {
            return response()->json([
                'success' => false,
                'message' => 'Warehouse not found',
            ], 404);
        }

        $updatedWarehouse = $this->warehouseService->updateWarehouse($warehouse, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Warehouse updated successfully',
            'data' => $updatedWarehouse,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $warehouse = $this->warehouseRepository->findById($id);

        if (!$warehouse) {
            return response()->json([
                'success' => false,
                'message' => 'Warehouse not found',
            ], 404);
        }

        $this->warehouseRepository->delete($warehouse);

        return response()->json([
            'success' => true,
            'message' => 'Warehouse deleted successfully',
        ]);
    }
}
