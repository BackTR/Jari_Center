<?php

namespace App\Application\Visit;

use App\Domain\Visit\Contracts\QueueRepositoryInterface;
use App\Models\Polyclinic;
use App\Models\Queue;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class GenerateQueueNumberService
{
    /** MySQL error code untuk pelanggaran unique constraint. */
    private const UNIQUE_VIOLATION = '23000';

    private const MAX_ATTEMPTS = 3;

    public function __construct(
        private readonly QueueRepositoryInterface $queueRepository,
    ) {
    }

    public function createFor(int $patientId, int $facilityId, ?int $polyclinicId, int $visitId): Queue
    {
        // Lock facility di dalam transaksi, lalu hitung. Dua registrasi
        // bersamaan akan serialize di sini, jadi tidak ada yang bisa membaca
        // count yang sama lalu menulis nomor yang sama.
        // Retry tetap dipakai sebagai jaring pengaman bila Unique index
        // tetap tersentuh (mis. penulisan lewat jalur lain di masa depan).
        for ($attempt = 1; $attempt <= self::MAX_ATTEMPTS; $attempt++) {
            try {
                return DB::transaction(function () use ($patientId, $facilityId, $polyclinicId, $visitId) {
                    $this->queueRepository->lockNumberingForFacility($facilityId);

                    $today = now()->toDateString();
                    $sequential = $this->queueRepository
                        ->countTodayByFacilityAndPolyclinic($facilityId, $polyclinicId, $today) + 1;

                    $prefix = 'U';
                    if ($polyclinicId) {
                        $polyclinic = Polyclinic::find($polyclinicId);
                        $prefix = $polyclinic ? strtoupper(substr($polyclinic->code, 0, 1)) : 'U';
                    }

                    return $this->queueRepository->create([
                        'patient_id' => $patientId,
                        'visit_id' => $visitId,
                        'facility_id' => $facilityId,
                        'polyclinic_id' => $polyclinicId,
                        'queue_number' => $prefix . '-' . str_pad((string) $sequential, 3, '0', STR_PAD_LEFT),
                        'queue_date' => $today,
                    ]);
                });
            } catch (QueryException $e) {
                if ($e->getCode() !== self::UNIQUE_VIOLATION || $attempt === self::MAX_ATTEMPTS) {
                    throw $e;
                }

                // Nomor bentrok — ulangi dari lock lagi.
            }
        }
    }
}