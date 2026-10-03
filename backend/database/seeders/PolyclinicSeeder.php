<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Polyclinic;
use Illuminate\Database\Seeder;

class PolyclinicSeeder extends Seeder
{
    public function run(): void
    {
        $polyclinics = [
            'PD' => 'Poli Penyakit Dalam',
            'ANAK' => 'Poli Anak',
            'UMUM' => 'Poli Umum',
            'GIGI' => 'Poli Gigi',
        ];

        foreach (Facility::all() as $facility) {
            foreach ($polyclinics as $code => $name) {
                Polyclinic::updateOrCreate(
                    ['facility_id' => $facility->id, 'code' => $code],
                    ['name' => $name, 'is_active' => true]
                );
            }
        }
    }
}
