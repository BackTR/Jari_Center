<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Polyclinic;
use Illuminate\Database\Seeder;

class PolyclinicSeeder extends Seeder
{
    public function run(): void
    {
        $rsSehatAbadi = Facility::where('code', 'RS001')->first();

        $polyclinics = [
            ['name' => 'Poli Penyakit Dalam', 'code' => 'PD'],
            ['name' => 'Poli Anak', 'code' => 'ANAK'],
            ['name' => 'Poli Umum', 'code' => 'UMUM'],
            ['name' => 'Poli Gigi', 'code' => 'GIGI'],
        ];

        foreach ($polyclinics as $poli) {
            Polyclinic::updateOrCreate(
                ['facility_id' => $rsSehatAbadi->id, 'code' => $poli['code']],
                ['name' => $poli['name'], 'is_active' => true]
            );
        }
    }
}