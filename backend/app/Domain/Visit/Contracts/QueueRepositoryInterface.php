<?php

namespace App\Domain\Visit\Contracts;

use App\Models\Queue;

interface QueueRepositoryInterface
{
    public function create(array $data): Queue;

    public function countTodayByFacilityAndPolyclinic(int $facilityId, ?int $polyclinicId, string $date): int;

    public function listTodayByFacility(int $facilityId, ?int $polyclinicId, string $date);
}