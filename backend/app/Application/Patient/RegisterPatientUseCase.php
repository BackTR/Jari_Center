<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Models\Patient;

class RegisterPatientUseCase
{
    public function __construct(
        private readonly PatientRepositoryInterface $patientRepository,
        private readonly JariIdGeneratorService $jariIdGenerator,
        private readonly AssignFacilityMedicalRecordService $assignFacilityMedicalRecordService,
    ) {
    }

    public function execute(array $data, ?int $facilityId = null): Patient
    {
        $data['jari_id'] = $this->jariIdGenerator->generate();

        $patient = $this->patientRepository->create($data);

        // Ikat pasien ke faskes tempat ia didaftarkan, supaya bisa dicari
        // kembali oleh petugas faskes itu (dan tidak oleh faskes lain).
        if ($facilityId) {
            $this->assignFacilityMedicalRecordService->getOrCreate($patient->id, $facilityId);
        }

        return $patient;
    }
}