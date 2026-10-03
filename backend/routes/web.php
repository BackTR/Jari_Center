<?php

use Illuminate\Support\Facades\Route;

// Backend ini API-only; UI-nya di frontend/ (React + Vite).
// Route '/' hanya penanda, bukan halaman aplikasi.
Route::get('/', fn () => response()->json([
    'name' => config('app.name'),
    'api' => url('/api'),
]));
