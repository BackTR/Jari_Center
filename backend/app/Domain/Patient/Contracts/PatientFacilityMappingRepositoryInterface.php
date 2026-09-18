<?php

namespace App\Domain\Patient\Contracts;

use App\Models\PatientFacilityMapping;

interface PatientFacilityMappingRepositoryInterface
{
    public function findByPatientAndFacility(int $patientId, int $facilityId): ?PatientFacilityMapping;

    public function create(array $data): PatientFacilityMapping;

    public function countByFacility(int $facilityId): int;
}