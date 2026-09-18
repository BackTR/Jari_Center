<?php

namespace App\Application\Visit;

use App\Domain\Visit\Contracts\QueueRepositoryInterface;
use App\Models\Polyclinic;
use App\Models\Queue;

class GenerateQueueNumberService
{
    public function __construct(
        private readonly QueueRepositoryInterface $queueRepository,
    ) {
    }

    public function createFor(int $patientId, int $facilityId, ?int $polyclinicId, int $visitId): Queue
    {
        $today = now()->toDateString();

        $sequential = $this->queueRepository->countTodayByFacilityAndPolyclinic($facilityId, $polyclinicId, $today) + 1;

        $prefix = 'U'; // default: Umum, kalau belum ada poli spesifik
        if ($polyclinicId) {
            $polyclinic = Polyclinic::find($polyclinicId);
            $prefix = $polyclinic ? strtoupper(substr($polyclinic->code, 0, 1)) : 'U';
        }

        $queueNumber = $prefix . '-' . str_pad((string) $sequential, 3, '0', STR_PAD_LEFT);

        return $this->queueRepository->create([
            'patient_id' => $patientId,
            'visit_id' => $visitId,
            'facility_id' => $facilityId,
            'polyclinic_id' => $polyclinicId,
            'queue_number' => $queueNumber,
            'queue_date' => $today,
            'status' => 'waiting',
        ]);
    }
}