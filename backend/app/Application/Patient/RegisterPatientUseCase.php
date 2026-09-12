<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Models\Patient;

class RegisterPatientUseCase
{
    public function __construct(
        private readonly PatientRepositoryInterface $patientRepository,
        private readonly JariIdGeneratorService $jariIdGenerator,
    ) {
    }

    public function execute(array $data): Patient
    {
        $data['jari_id'] = $this->jariIdGenerator->generate();

        return $this->patientRepository->create($data);
    }
}