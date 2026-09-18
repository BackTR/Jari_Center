<?php

namespace App\Infrastructure\Providers;

use App\Domain\Facility\Contracts\DashboardRepositoryInterface;
use App\Domain\Patient\Contracts\PatientFacilityMappingRepositoryInterface;
use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Domain\Visit\Contracts\QueueRepositoryInterface;
use App\Domain\Visit\Contracts\VisitRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\EloquentDashboardRepository;
use App\Infrastructure\Persistence\Eloquent\EloquentPatientFacilityMappingRepository;
use App\Infrastructure\Persistence\Eloquent\EloquentPatientRepository;
use App\Infrastructure\Persistence\Eloquent\EloquentQueueRepository;
use App\Infrastructure\Persistence\Eloquent\EloquentVisitRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PatientRepositoryInterface::class, EloquentPatientRepository::class);
        $this->app->bind(VisitRepositoryInterface::class, EloquentVisitRepository::class);
        $this->app->bind(DashboardRepositoryInterface::class, EloquentDashboardRepository::class);
        $this->app->bind(PatientFacilityMappingRepositoryInterface::class, EloquentPatientFacilityMappingRepository::class);
        $this->app->bind(QueueRepositoryInterface::class, EloquentQueueRepository::class);
    }
}