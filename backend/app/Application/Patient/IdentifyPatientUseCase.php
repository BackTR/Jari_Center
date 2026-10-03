<?php

namespace App\Application\Patient;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Support\Collection;

class IdentifyPatientUseCase
{
    public function __construct(
        private readonly PatientRepositoryInterface $patientRepository,
    ) {
    }

    public function execute(string $type, string $value, User $user): Collection
    {
        $facilityId = $user->role === 'super_admin' ? null : $user->facility_id;

        return match ($type) {
            'jari_id' => $this->wrapSingle($this->patientRepository->findByJariId($value, $facilityId)),
            'nik' => $this->wrapSingle($this->patientRepository->findByNik($value, $facilityId)),
            'keyword' => $this->patientRepository->search($value, $facilityId),
            default => collect(),
        };
    }

    private function wrapSingle(?Patient $patient): Collection
    {
        return $patient ? collect([$patient]) : collect();
    }
}
