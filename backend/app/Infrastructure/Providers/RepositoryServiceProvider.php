<?php

namespace App\Infrastructure\Providers;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Domain\Visit\Contracts\VisitRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\EloquentPatientRepository;
use App\Infrastructure\Persistence\Eloquent\EloquentVisitRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            PatientRepositoryInterface::class,
            EloquentPatientRepository::class
        );

        $this->app->bind(
            VisitRepositoryInterface::class,
            EloquentVisitRepository::class
        );
    }
}