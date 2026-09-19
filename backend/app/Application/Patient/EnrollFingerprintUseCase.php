<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Models\Patient;
use RuntimeException;

class EnrollFingerprintUseCase
{
    public function __construct(
        private readonly PatientRepositoryInterface $patientRepository,
        private readonly FingerprintSimulationService $fingerprintService,
    ) {
    }

    public function execute(Patient $patient, string $template): Patient
    {
        $hash = $this->fingerprintService->hashTemplate($template);

        $existing = $this->patientRepository->findByFingerprintHash($hash);

        if ($existing && $existing->id !== $patient->id) {
            throw new RuntimeException(
                'Sidik jari ini sudah terdaftar atas pasien lain.'
            );
        }

        return $this->patientRepository->updateFingerprintHash($patient, $hash);
    }
}