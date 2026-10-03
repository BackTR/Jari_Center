<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        return [
            'jari_id' => 'JARI-' . date('Y') . '-' . fake()->unique()->numerify('########'),
            'nik' => fake()->unique()->numerify('################'),
            'name' => fake()->name(),
            'date_of_birth' => fake()->date(),
            'gender' => fake()->randomElement(['male', 'female']),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'insurance_provider' => fake()->randomElement(['BPJS', 'Mandiri', null]),
            'insurance_number' => fake()->optional()->numerify('##########'),
            'fingerprint_template_hash' => null,
        ];
    }
}
