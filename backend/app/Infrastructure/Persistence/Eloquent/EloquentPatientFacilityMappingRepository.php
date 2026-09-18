<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Patient\Contracts\PatientFacilityMappingRepositoryInterface;
use App\Models\PatientFacilityMapping;

class EloquentPatientFacilityMappingRepository implements PatientFacilityMappingRepositoryInterface
{
    public function findByPatientAndFacility(int $patientId, int $facilityId): ?PatientFacilityMapping
    {
        return PatientFacilityMapping::where('patient_id', $patientId)
            ->where('facility_id', $facilityId)
            ->first();
    }

    public function create(array $data): PatientFacilityMapping
    {
        return PatientFacilityMapping::create($data);
    }

    public function countByFacility(int $facilityId): int
    {
        return PatientFacilityMapping::where('facility_id', $facilityId)->count();
    }
}