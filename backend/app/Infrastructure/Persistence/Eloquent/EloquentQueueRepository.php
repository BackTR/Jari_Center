<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Visit\Contracts\QueueRepositoryInterface;
use App\Models\Facility;
use App\Models\Queue;
use Illuminate\Support\Collection;
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

    /**
     * Baris faskes jadi mutex saat menghitung nomor antrean. Satu baris
     * selalu ada, jadi ini juga mengunci kasus polyclinic_id NULL (queue
     * Umum) yang tidak bisa dilindungi UNIQUE index.
     */
    public function lockNumberingForFacility(int $facilityId): void
    {
        Facility::where('id', $facilityId)->lockForUpdate()->first();
    }

    #[Override]
    public function listTodayByFacility(int $facilityId, ?int $polyclinicId, string $date): Collection
    {
        return Queue::where('facility_id', $facilityId)
            ->when($polyclinicId, fn ($query) => $query->where('polyclinic_id', $polyclinicId))
            ->whereDate('queue_date', $date)
            ->with([
                'patient:id,jari_id,name',
                'polyclinic:id,name,code',
                // currentStatus() membaca visit->status; tanpa ini
                // setiap baris antrean menembak query sendiri (N+1).
                'visit:id,status',
            ])
            ->orderBy('queue_number')
            ->get();
    }
}