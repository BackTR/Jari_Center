<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        Facility::updateOrCreate(
            ['code' => 'RS001'],
            [
                'name' => 'RS Sehat Abadi',
                'type' => 'hospital',
                'address' => 'Jl. Kesehatan No. 1, Jakarta',
                'phone' => '021-1234567',
                'is_active' => true,
            ]
        );

        Facility::updateOrCreate(
            ['code' => 'KLN001'],
            [
                'name' => 'Klinik Sehat Ceria',
                'type' => 'clinic',
                'address' => 'Jl. Cempaka No. 5, Bandung',
                'phone' => '022-7654321',
                'is_active' => true,
            ]
        );

        Facility::updateOrCreate(
            ['code' => 'PKM001'],
            [
                'name' => 'Puskesmas Melati',
                'type' => 'puskesmas',
                'address' => 'Jl. Melati No. 12, Surabaya',
                'phone' => '031-1122334',
                'is_active' => true,
            ]
        );
    }
}