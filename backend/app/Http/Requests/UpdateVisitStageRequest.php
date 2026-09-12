<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVisitStageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stage' => ['required', 'in:verified,registered,in_service,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ];
    }
}