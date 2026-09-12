<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\VisitController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/facilities/{facilityId}/dashboard', [DashboardController::class, 'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients/identify', [PatientController::class, 'identify']);

    Route::post('/visits', [VisitController::class, 'store']);
    Route::get('/visits/{visit}', [VisitController::class, 'show']);
    Route::patch('/visits/{visit}/stage', [VisitController::class, 'updateStage']);
});