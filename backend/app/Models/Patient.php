<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'jari_id', 'nik', 'name', 'date_of_birth', 'gender',
        'address', 'phone', 'insurance_provider', 'insurance_number',
        'fingerprint_template_hash',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function facilityMappings(): HasMany
    {
        return $this->hasMany(PatientFacilityMapping::class);
    }

    /**
     * Satu-satunya definisi "pasien ini milik faskes tersebut": sudah pernah
     * punya Nomor RM di sana, atau pernah punya kunjungan di sana.
     * Dipakai PatientRepository (pencarian) dan User::canReachPatient
     * (sidik jari) supaya keduanya tidak bisa berbeda.
     *
     * @param  Builder<Patient>  $query
     * @return Builder<Patient>
     */
    public function scopeLinkedToFacility(Builder $query, int $facilityId): Builder
    {
        return $query->where(fn (Builder $q) => $q
            ->whereHas('facilityMappings', fn (Builder $m) => $m->where('facility_id', $facilityId))
            ->orWhereHas('visits', fn (Builder $v) => $v->where('facility_id', $facilityId)));
    }

    public function queues():HasMany
    {
    return $this->hasMany(Queue::class);
    }

    public function visits():HasMany
    {
        return $this->hasMany(Visit::class);
    }
}