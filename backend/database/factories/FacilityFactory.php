<?php

namespace Database\Factories;

use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;

class FacilityFactory extends Factory
{
    protected $model = Facility::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'type' => fake()->randomElement(['hospital', 'clinic', 'puskesmas']),
            'code' => fake()->unique()->bothify('FAC####'),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'is_active' => true,
        ];
    }
}
