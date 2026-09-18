<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Visit\Contracts\QueueRepositoryInterface;
use App\Models\Queue;
use Override;

class EloquentQueueRepository implements QueueRepositoryInterface
{
    public function create(array $data): Queue
    {
        return Queue::create($data);
    }

    public function countTodayByFacilityAndPolyclinic(int $facilityId, ?int $polyclinicId, string $date): int
    {
        return Queue::where('facility_id', $facilityId)
            ->where('polyclinic_id', $polyclinicId)
            ->whereDate('queue_date', $date)
            ->count();
    }

    #[Override]
    public function listTodayByFacility(int $facilityId, ?int $polyclinicId, string $date)
    {
        return Queue::where('facility_id', $facilityId)
            ->when($polyclinicId, fn ($query) => $query->where('polyclinic_Id', $polyclinicId))
            ->wheredate('queue_date', $date)
            ->with(['patient:id,jari_id,name', 'polyclinic:id,name,code'])
            ->orderby('queue_number')
            ->get();
    }
        
}