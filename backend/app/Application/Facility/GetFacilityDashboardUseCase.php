<?php

namespace App\Application\Facility;

use App\Domain\Facility\Contracts\DashboardRepositoryInterface;

class GetFacilityDashboardUseCase
{
    public function __construct(
        private readonly DashboardRepositoryInterface $dashboardRepository,
    ) {
    }

    public function execute(int $facilityId, ?string $date = null): array
    {
        $date ??= now()->toDateString();

        return $this->dashboardRepository->getFacilitySummary($facilityId, $date);
    }
}