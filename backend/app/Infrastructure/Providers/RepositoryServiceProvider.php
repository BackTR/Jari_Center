<?php

namespace App\Infrastructure\Providers;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\EloquentPatientRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            PatientRepositoryInterface::class,
            EloquentPatientRepository::class
        );
    }
}