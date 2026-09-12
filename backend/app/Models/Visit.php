<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Visit extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'facility_id', 'polyclinic_id', 'registered_by', 'doctor_id',
        'identification_method', 'payment_method', 'bpjs_number', 'bpjs_verified_at',
        'referral_letter_number', 'status', 'notes',
    ];

    protected $casts = [
        'bpjs_verified_at' => 'datetime',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function polyclinic(): BelongsTo
    {
        return $this->belongsTo(Polyclinic::class);
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function stageLogs(): HasMany
    {
        return $this->hasMany(VisitStageLog::class);
    }

    public function queue(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Queue::class);
    }
}