<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id' => $this->id,
            'jari_id' => $this->jari_id,
            'nik' => $this->nik,
            'name' => $this->name,
            'date_of_birth' => $this->date_of_birth->format('Y-m-d'),
            'gender' => $this->gender,
            'address' => $this->address,
            'phone' => $this->phone,
            'insurance_provider' => $this->insurance_provider,
            'insurance_number' => $this->insurance_number,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
