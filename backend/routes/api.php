<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public endpoints (Customer)
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{tracking_id}', [OrderController::class, 'track']);
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);

// Admin authentication (Public)
Route::post('/admin/login', [AdminController::class, 'login']);

// Protected endpoints (Admin)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Admin auth
    Route::post('/logout', [AdminController::class, 'logout']);
    Route::get('/me', [AdminController::class, 'me']);

    // Order management
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::put('/orders/{id}', [AdminOrderController::class, 'update']);
    Route::delete('/orders/{id}', [AdminOrderController::class, 'destroy']);
    Route::delete('/orders-reset', [AdminOrderController::class, 'reset']);

    // Settings management
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update']);

    // Dashboard stats
    Route::get('/stats', [AdminOrderController::class, 'stats']);

    // Service management
    Route::get('/services', [ServiceController::class, 'adminIndex']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
});
