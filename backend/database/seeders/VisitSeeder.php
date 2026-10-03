<?php

namespace Database\Seeders;

use App\Application\Patient\JariIdGeneratorService;
use App\Application\Visit\RegisterVisitUseCase;
use App\Application\Visit\UpdateVisitStageUseCase;
use App\Models\Facility;
use App\Models\Patient;
use App\Models\Polyclinic;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Demo data untuk dashboard: kunjungan tersebar di beberapa stage supaya
 * kartu statistik dan antrean tidak kosong.
 *
 * Memakai use case yang sama dengan HTTP, jadi yang ter-seed otomatis punya
 * Nomor RM, nomor antrean, dan stage log — tidak ada jalur data kedua.
 */
class VisitSeeder extends Seeder
{
    private const array STAGES = [
        'pending_verification',
        'verified',
        'registered',
        'in_service',
        'completed',
    ];

    private const array NAMES = [
        'Siti Aminah', 'Budi Santoso', 'Dewi Lestari', 'Agus Salim',
        'Rina Kusuma', 'Hendra Gunawan', 'Maya Puspita', 'Rizky Pratama',
        'Nurul Hidayah', 'Fajar Nugroho', 'Intan Permata', 'Bayu Saputra',
    ];

    public function run(): void
    {
        $registerVisit = app(RegisterVisitUseCase::class);
        $updateStage = app(UpdateVisitStageUseCase::class);

        foreach (Facility::all() as $facility) {
            $petugas = User::where('facility_id', $facility->id)->where('is_active', true)->first();

            if (! $petugas) {
                continue;
            }

            $polyclinicIds = Polyclinic::where('facility_id', $facility->id)->pluck('id')->all();

            // Satu kunjungan per stage, supaya tiap kartu dashboard punya angka.
            foreach (self::STAGES as $index => $targetStage) {
                $patient = $this->patientFor($facility, $index);

                if ($patient->visits()->where('facility_id', $facility->id)->exists()) {
                    continue;
                }

                $visit = $registerVisit->execute([
                    'patient_id' => $patient->id,
                    'facility_id' => $facility->id,
                    'polyclinic_id' => $polyclinicIds[$index % count($polyclinicIds)],
                    'identification_method' => 'nik',
                    'payment_method' => $index % 2 === 0 ? 'bpjs' : 'mandiri',
                    'bpjs_number' => $index % 2 === 0 ? '0001234567890' : null,
                    'referral_letter_number' => null,
                    'notes' => null,
                ], $petugas->id);

                for ($step = 1; $step <= $index; $step++) {
                    $visit = $updateStage->execute(
                        $visit,
                        self::STAGES[$step],
                        'Demo seeding.',
                        $petugas->id,
                    );
                }
            }
        }
    }

    private function patientFor(Facility $facility, int $index): Patient
    {
        $name = self::NAMES[$index % count(self::NAMES)];
        $isBpjs = $index % 2 === 0;

        return Patient::firstOrCreate(
            ['nik' => '3175' . str_pad((string) ($facility->id * 10 + $index), 11, '0', STR_PAD_LEFT)],
            [
                'jari_id' => app(JariIdGeneratorService::class)->generate(),
                'name' => $name . ' (' . $facility->code . ')',
                'date_of_birth' => now()->subYears(20 + $index)->toDateString(),
                'gender' => $isBpjs ? 'female' : 'male',
                'address' => 'Jl. Demo No. ' . ($index + 1),
                'phone' => '0812' . str_pad((string) ($facility->id * 1000 + $index), 7, '0', STR_PAD_LEFT),
                'insurance_provider' => $isBpjs ? 'BPJS' : null,
                'insurance_number' => $isBpjs ? '000' . str_pad((string) $index, 10, '0', STR_PAD_LEFT) : null,
            ],
        );
    }

    }
