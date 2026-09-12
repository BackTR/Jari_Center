<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient' => [
                'id' => $this->patient->id,
                'jari_id' => $this->patient->jari_id,
                'name' => $this->patient->name,
            ],
            'facility_id' => $this->facility_id,
            'polyclinic_id' => $this->polyclinic_id,
            'identification_method' => $this->identification_method,
            'payment_method' => $this->payment_method,
            'bpjs_number' => $this->bpjs_number,
            'referral_letter_number' => $this->referral_letter_number,
            'status' => $this->status,
            'notes' => $this->notes,
            'stage_history' => $this->whenLoaded('stageLogs', function () {
                return $this->stageLogs->map(fn ($log) => [
                    'stage' => $log->stage,
                    'notes' => $log->notes,
                    'changed_at' => $log->created_at->toIso8601String(),
                ]);
            }),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}