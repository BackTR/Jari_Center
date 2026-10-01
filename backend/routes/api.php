<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\VisitController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FingerprintController;
use App\Http\Controllers\Api\PolyclinicController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\AdminController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/facilities/{facilityId}/dashboard', [DashboardController::class, 'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients/identify', [PatientController::class, 'identify']);

    Route::post('/visits', [VisitController::class, 'store']);
    Route::get('/visits', [VisitController::class, 'index']);
    Route::get('/visits/{visit}', [VisitController::class, 'show']);
    Route::patch('/visits/{visit}/stage', [VisitController::class, 'updateStage']);
    Route::get('/facilities/{facilityId}/queues', [DashboardController::class, 'queues']);
    Route::get('/queues', [QueueController::class, 'index']);
    Route::get('/polyclinics', [PolyclinicController::class, 'index']);
    Route::post('/patients/{patientId}/fingerprint/enroll', [FingerprintController::class, 'enroll']);
    Route::post('/fingerprint/match', [FingerprintController::class, 'match']);

    // Admin routes - only super_admin can access
    Route::middleware('role:super_admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/facilities', [AdminController::class, 'facilities']);
        Route::post('/facilities', [AdminController::class, 'storeFacility']);
        Route::put('/facilities/{id}', [AdminController::class, 'updateFacility']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'storeUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::patch('/users/{id}/reset-password', [AdminController::class, 'resetPassword']);
        Route::get('/activities', [AdminController::class, 'activities']);
    });
});