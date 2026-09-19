<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Models\Patient;

class MatchFingerprintUseCase
{
    public function __construct(
        private readonly PatientRepositoryInterface $patientRepository,
        private readonly FingerprintSimulationService $fingerprintService,
    ) {
    }

    public function execute(string $template): ?Patient
    {
        $hash = $this->fingerprintService->hashTemplate($template);

        return $this->patientRepository->findByFingerprintHash($hash);
    }
}