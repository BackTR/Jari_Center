<?php

namespace Database\Seeders;

use App\Application\Patient\JariIdGeneratorService;
use App\Models\Patient;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $jariIdGenerator = app(JariIdGeneratorService::class);

        $patients = [
            [
                'nik' => '3175010101680001',
                'name' => 'Siti Aminah',
                'date_of_birth' => '1968-05-12',
                'gender' => 'female',
                'address' => 'Jl. Merdeka No. 10, Jakarta',
                'phone' => '081234567890',
                'insurance_provider' => 'BPJS',
                'insurance_number' => '0001234567890',
            ],
            [
                'nik' => '3175020202900002',
                'name' => 'Budi Santoso',
                'date_of_birth' => '1990-02-02',
                'gender' => 'male',
                'address' => 'Jl. Sudirman No. 20, Jakarta',
                'phone' => '081298765432',
                'insurance_provider' => null,
                'insurance_number' => null,
            ],
        ];

        foreach ($patients as $data) {
            $existing = Patient::where('nik', $data['nik'])->first();

            if (! $existing) {
                $data['jari_id'] = $jariIdGenerator->generate();
                Patient::create($data);
            }
        }
    }
}