<?php

namespace Database\Factories;

use App\Models\Visit;
use App\Models\Patient;
use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;

class VisitFactory extends Factory
{
    protected $model = Visit::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'facility_id' => Facility::factory(),
            'polyclinic_id' => null,
            'registered_by' => null,
            'doctor_id' => null,
            'identification_method' => fake()->randomElement(['jari_id', 'nik', 'fingerprint_simulation', 'qr_code', 'manual']),
            'payment_method' => fake()->randomElement(['mandiri', 'bpjs']),
            'bpjs_number' => fake()->optional()->numerify('##########'),
            'bpjs_verified_at' => null,
            'referral_letter_number' => null,
            'status' => 'pending_verification',
            'notes' => null,
        ];
    }
}
