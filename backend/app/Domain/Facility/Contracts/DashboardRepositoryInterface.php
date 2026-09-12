<?php

namespace App\Domain\Facility\Contracts;

interface DashboardRepositoryInterface
{
    public function getFacilitySummary(int $facilityId, string $date): array;
}