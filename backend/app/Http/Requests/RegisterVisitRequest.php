<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'facility_id' => ['required', 'exists:facilities,id'],
            'polyclinic_id' => ['nullable', 'exists:polyclinics,id'],
            'identification_method' => ['required', 'in:jari_id,nik,fingerprint_simulation,qr_code,manual'],
            'payment_method' => ['required', 'in:mandiri,bpjs'],
            'bpjs_number' => ['required_if:payment_method,bpjs', 'nullable', 'string', 'max:20'],
            'referral_letter_number' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ];
    }
}