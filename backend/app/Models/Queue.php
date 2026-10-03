<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'visit_id', 'facility_id', 'polyclinic_id',
        'queue_number', 'queue_date',
    ];

    protected $casts = [
        'queue_date' => 'date',
    ];

    /**
     * Tahap antrean mengikuti tahap kunjungan (visits.status) — jangan
     * simpan status sendiri di sini, itu pernah jadi sumber kedua yang
     * tidak pernah ter-update.
     */
    public function currentStatus(): string
    {
        return $this->visit?->status ?? 'pending_verification';
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function polyclinic(): BelongsTo
    {
        return $this->belongsTo(Polyclinic::class);
    }
}