<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use Illuminate\Support\Collection;

class IdentifyPatientUseCase
{
    public function __construct(
        private readonly PatientRepositoryInterface $patientRepository,
    ) {
    }

    public function execute(string $type, string $value): Collection
    {
        return match ($type) {
            'jari_id' => $this->wrapSingle($this->patientRepository->findByJariId($value)),
            'nik' => $this->wrapSingle($this->patientRepository->findByNik($value)),
            'keyword' => $this->patientRepository->search($value),
            default => collect(),
        };
    }

    private function wrapSingle(?\App\Models\Patient $patient): Collection
    {
        return $patient ? collect([$patient]) : collect();
    }
}