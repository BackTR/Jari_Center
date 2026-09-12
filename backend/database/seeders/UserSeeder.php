<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $rsSehatAbadi = Facility::where('code', 'RS001')->first();
        $klinikCeria = Facility::where('code', 'KLN001')->first();

        User::updateOrCreate(
            ['email' => 'superadmin@jaricenter.test'],
            [
                'name' => 'Super Admin Jari Center',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
                'facility_id' => null,
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'andi@jaricenter.test'],
            [
                'name' => 'Andi Pratama',
                'password' => Hash::make('password123'),
                'role' => 'petugas_registrasi',
                'facility_id' => $rsSehatAbadi->id,
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'budi.dokter@jaricenter.test'],
            [
                'name' => 'dr. Budi Santoso, Sp.PD',
                'password' => Hash::make('password123'),
                'role' => 'dokter',
                'facility_id' => $rsSehatAbadi->id,
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin.klinik@jaricenter.test'],
            [
                'name' => 'Rina (Admin Klinik Ceria)',
                'password' => Hash::make('password123'),
                'role' => 'facility_admin',
                'facility_id' => $klinikCeria->id,
                'is_active' => true,
            ]
        );
    }
}