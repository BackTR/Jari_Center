<?php

namespace App\Application\Visit;

use App\Application\Patient\AssignFacilityMedicalRecordService;
use App\Domain\Visit\Contracts\VisitRepositoryInterface;
use App\Models\Visit;
use App\Models\VisitStageLog;

class RegisterVisitUseCase
{
    public function __construct(
        private readonly VisitRepositoryInterface $visitRepository,
        private readonly AssignFacilityMedicalRecordService $assignFacilityMedicalRecordService,
        private readonly GenerateQueueNumberService $generateQueueNumberService,
    ) {
    }

    public function execute(array $data, int $registeredByUserId): Visit
    {
        $data['registered_by'] = $registeredByUserId;
        $data['status'] = 'pending_verification';

        $visit = $this->visitRepository->create($data);

        // Pastikan pasien punya Nomor RM di faskes ini
        $this->assignFacilityMedicalRecordService->getOrCreate(
            $visit->patient_id,
            $visit->facility_id,
        );

        // Buat nomor antrean untuk visit ini
        $this->generateQueueNumberService->createFor(
            $visit->patient_id,
            $visit->facility_id,
            $visit->polyclinic_id,
            $visit->id,
        );

        VisitStageLog::create([
            'visit_id' => $visit->id,
            'changed_by' => $registeredByUserId,
            'stage' => 'pending_verification',
            'notes' => 'Kunjungan dibuat, menunggu verifikasi petugas.',
            'created_at' => now(),
        ]);

        return $visit->fresh(['stageLogs', 'queue']);
    }
}