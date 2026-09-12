<?php

namespace App\Application\Visit;

use App\Domain\Visit\Contracts\VisitRepositoryInterface;
use App\Models\Visit;
use App\Models\VisitStageLog;

class RegisterVisitUseCase
{
    public function __construct(
        private readonly VisitRepositoryInterface $visitRepository,
    ) {
    }

    public function execute(array $data, int $registeredByUserId): Visit
    {
        $data['registered_by'] = $registeredByUserId;
        $data['status'] = 'pending_verification';

        $visit = $this->visitRepository->create($data);

        VisitStageLog::create([
            'visit_id' => $visit->id,
            'changed_by' => $registeredByUserId,
            'stage' => 'pending_verification',
            'notes' => 'Kunjungan dibuat, menunggu verifikasi petugas.',
            'created_at' => now(),
        ]);

        return $visit->fresh('stageLogs');
    }
}