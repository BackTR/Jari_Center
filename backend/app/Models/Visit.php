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
        'patient_id', 'facility_id', 'polyclinic_id', 'registered_by',
        'identification_method', 'payment_method', 'bpjs_number',
        'referral_letter_number', 'status', 'notes',
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

    

    public function stageLogs(): HasMany
    {
        return $this->hasMany(VisitStageLog::class);
    }

    public function queue(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Queue::class);
    }
}