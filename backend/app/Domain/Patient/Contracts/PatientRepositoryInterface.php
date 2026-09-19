<?php

namespace App\Domain\Patient\Contracts;

use App\Models\Patient;
use Illuminate\Support\Collection;

interface PatientRepositoryInterface
{
    public function findByJariId(string $jariId): ?Patient;

    public function findByNik(string $nik): ?Patient;

    public function search(string $keyword): Collection;

    public function create(array $data): Patient;

    public function existsByJariId(string $jariId): bool;

    public function findByFingerprintHash(string $hash): ?Patient;

    public function updateFingerprintHash(Patient $patient, string $hash): Patient;
}