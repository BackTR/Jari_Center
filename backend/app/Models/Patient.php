<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    public function profile(): HasOne
    {
        return $this->hasOne(PatientProfile::class);
    }

    public function facilityMappings():HasMany
    {
    return $this->hasMany(PatientFacilityMapping::class);
    }

    public function queues():HasMany
    {
    return $this->hasMany(Queue::class);
    }
}