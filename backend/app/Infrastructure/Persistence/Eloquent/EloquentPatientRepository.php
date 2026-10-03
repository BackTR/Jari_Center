<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Patient\Contracts\PatientRepositoryInterface;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class EloquentPatientRepository implements PatientRepositoryInterface
{
    public function findByJariId(string $jariId, ?int $facilityId = null): ?Patient
    {
        return $this->scopedToFacility($facilityId)->where('jari_id', $jariId)->first();
    }

    public function findByNik(string $nik, ?int $facilityId = null): ?Patient
    {
        return $this->scopedToFacility($facilityId)->where('nik', $nik)->first();
    }

    public function search(string $keyword, ?int $facilityId = null): Collection
    {
        return $this->scopedToFacility($facilityId)
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%{$keyword}%")
                    ->orWhere('nik', 'like', "%{$keyword}%")
                    ->orWhere('jari_id', 'like', "%{$keyword}%");
            })
            ->limit(20)
            ->get();
    }

    /**
     * Pasien bersifat global, tapi petugas hanya boleh melihat pasien yang
     * sudah pernah terdaftar di faskes-nya. Super admin kirim null (tanpa scope).
     */
    private function scopedToFacility(?int $facilityId): Builder
    {
        $query = Patient::query();

        if ($facilityId === null) {
            return $query;
        }

        // Aturan "milik faskes ini" didefinisikan di Patient::scopeLinkedToFacility
        // supaya tidak bisa berbeda dari User::canReachPatient (sidik jari).
        return $query->linkedToFacility($facilityId);
    }

    public function create(array $data): Patient
    {
        return Patient::create($data);
    }

    public function existsByJariId(string $jariId): bool
    {
        return Patient::where('jari_id', $jariId)->exists();
    }

    public function findByFingerprintHash(string $hash): ?Patient
    {
        return Patient::where('fingerprint_template_hash', $hash)->first();
    }

    public function updateFingerprintHash(Patient $patient, string $hash): Patient
    {
        $patient->update(['fingerprint_template_hash' => $hash]);

        return $patient->fresh();
    }
}