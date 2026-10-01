<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    use HasFactory;
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

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function polyclinics():HasMany
    {
        return $this->hasMany(Polyclinic::class);
    }

    public function patientMappings():HasMany
    {
        return $this->hasMany(PatientFacilityMapping::class);
    }
    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class);
    }
}
