<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitStageLog extends Model
{
    public $timestamps = false; // cuma ada created_at, kita urus manual

    protected $fillable = ['visit_id', 'changed_by', 'stage', 'notes', 'created_at'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}