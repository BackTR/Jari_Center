<?php

namespace App\Domain\Visit\Contracts;

use App\Models\Queue;
use Illuminate\Support\Collection;

interface QueueRepositoryInterface
{
    public function create(array $data): Queue;

    public function countTodayByFacilityAndPolyclinic(int $facilityId, ?int $polyclinicId, string $date): int;

    /** Kunci baris faskes sebagai mutex penomoran; selalu ada, aman untuk polyclinic_id NULL. */
    public function lockNumberingForFacility(int $facilityId): void;

    public function listTodayByFacility(int $facilityId, ?int $polyclinicId, string $date): Collection;
}