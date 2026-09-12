<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;

class JariIdGeneratorService
{
    public function __construct(
        private readonly PatientRepositoryInterface $patientRepository,
    ) {
    }

    public function generate(): string
    {
        $prefix = config('services.jari_id.prefix', 'JARI');
        $year = now()->year;

        do {
            $randomDigits = str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
            $candidate = "{$prefix}-{$year}-{$randomDigits}";
        } while ($this->patientRepository->existsByJariId($candidate));

        return $candidate;
    }
}