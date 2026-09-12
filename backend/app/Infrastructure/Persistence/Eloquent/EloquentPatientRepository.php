<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Models\Patient;
use Illuminate\Support\Collection;

class EloquentPatientRepository implements PatientRepositoryInterface
{
    public function findByJariId(string $jariId): ?Patient
    {
        return Patient::where('jari_id', $jariId)->first();
    }

    public function findByNik(string $nik): ?Patient
    {
        return Patient::where('nik', $nik)->first();
    }

    public function search(string $keyword): Collection
    {
        return Patient::where('name', 'like', "%{$keyword}%")
            ->orWhere('nik', 'like', "%{$keyword}%")
            ->orWhere('jari_id', 'like', "%{$keyword}%")
            ->limit(20)
            ->get();
    }

    public function create(array $data): Patient
    {
        return Patient::create($data);
    }

    public function existsByJariId(string $jariId): bool
    {
        return Patient::where('jari_id', $jariId)->exists();
    }
}