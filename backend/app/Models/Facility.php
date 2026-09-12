<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    protected $fillable = [
        'name',
        'type',
        'code',
        'address',
        'phone',
        'is_active',
    ];

    protected $casts = [
        "is_active" => 'boolean',
    ];

    public function users():HasMany{
        return $this->hasMany(user::class);
    }

    public function polyclinics():HasMany
    {
        return $this->hasMany(Polyclinic::class);
    }

    public function patientMappings():HasMany
    {
        return $this->hasMany(PatientFacilityMapping::class);
    }
    public function visits():HasMany
    {
        return $this->hasMany(visit::class);
    }
}
