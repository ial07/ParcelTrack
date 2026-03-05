<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ParcelController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\WarehouseController;
use Illuminate\Support\Facades\Route;

// Public Tracking API
Route::get('/track/{trackingNumber}', [TrackingController::class, 'track']);

// Admin Auth
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Admin Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth Profile & Logout
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Admin Dashboard
    Route::get('/admin/dashboard/metrics', [DashboardController::class, 'metrics']);

    // Admin Parcels Routes
    Route::get('/admin/parcels', [ParcelController::class, 'index']);
    Route::get('/admin/parcels/{id}', [ParcelController::class, 'show']);
    Route::post('/admin/parcels', [ParcelController::class, 'store']);
    Route::post('/admin/parcels/{id}/status', [ParcelController::class, 'updateStatus']);

    // Admin Warehouses Routes
    Route::get('/admin/warehouses', [WarehouseController::class, 'index']);
    Route::post('/admin/warehouses', [WarehouseController::class, 'store']);
    Route::get('/admin/warehouses/{id}', [WarehouseController::class, 'show']);
    Route::put('/admin/warehouses/{id}', [WarehouseController::class, 'update']);
    Route::delete('/admin/warehouses/{id}', [WarehouseController::class, 'destroy']);

    // Admin Couriers Routes
    Route::get('/admin/couriers', [CourierController::class, 'index']);
});
