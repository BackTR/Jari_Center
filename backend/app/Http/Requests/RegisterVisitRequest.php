<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            // Poliklinik harus milik facility_id yang dikirim, bukan poliklinik
            // faskes lain — kalau tidak, antrean & dashboard faskes A bisa
            // menampilkan nama/kode poliklinik faskes B.
            'polyclinic_id' => [
                'nullable',
                Rule::exists('polyclinics', 'id')->where('facility_id', $this->input('facility_id')),
            ],
            'identification_method' => ['required', 'in:jari_id,nik,fingerprint_simulation,qr_code,manual'],
            'payment_method' => ['required', 'in:mandiri,bpjs'],
            'bpjs_number' => ['required_if:payment_method,bpjs', 'string', 'max:20'],
            'referral_letter_number' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ];
    }
}