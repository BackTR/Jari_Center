<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientFacilityMappingRepositoryInterface;
use App\Models\PatientFacilityMapping;

class AssignFacilityMedicalRecordService
{
    public function __construct(
        private readonly PatientFacilityMappingRepositoryInterface $mappingRepository,
    ) {
    }

    public function getOrCreate(int $patientId, int $facilityId): PatientFacilityMapping
    {
        $existing = $this->mappingRepository->findByPatientAndFacility($patientId, $facilityId);

        if ($existing) {
            return $existing;
        }

        $sequential = $this->mappingRepository->countByFacility($facilityId) + 1;
        $mrn = 'RM' . str_pad((string) $sequential, 9, '0', STR_PAD_LEFT);

        return $this->mappingRepository->create([
            'patient_id' => $patientId,
            'facility_id' => $facilityId,
            'medical_record_number' => $mrn,
        ]);
    }
}