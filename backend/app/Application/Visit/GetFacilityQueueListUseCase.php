<?php

namespace App\Application\Visit;

use App\Domain\Visit\Contracts\QueueRepositoryInterface;
use Illuminate\Support\Collection;

class GetFacilityQueueListUseCase
{
    public function __construct(
        private readonly QueueRepositoryInterface $queueRepository,
    ) {
    }

    public function execute(int $facilityId, ?int $polyclinicId = null, ?string $date = null): Collection
    {
        $date ??= now()->toDateString();

        return $this->queueRepository->listTodayByFacility($facilityId, $polyclinicId, $date);
    }
}