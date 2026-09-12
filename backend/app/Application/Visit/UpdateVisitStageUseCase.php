<?php

namespace App\Application\Visit;

use App\Domain\Visit\Contracts\VisitRepositoryInterface;
use App\Models\Visit;
use App\Models\VisitStageLog;
use InvalidArgumentException;

class UpdateVisitStageUseCase
{
    // Aturan bisnis: tahap cuma boleh maju berurutan, tidak boleh loncat
    private const array ALLOWED_TRANSITIONS = [
        'pending_verification' => ['verified', 'cancelled'],
        'verified' => ['registered', 'cancelled'],
        'registered' => ['in_service', 'cancelled'],
        'in_service' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    public function __construct(
        private readonly VisitRepositoryInterface $visitRepository,
    ) {
    }

    public function execute(Visit $visit, string $newStage, ?string $notes, int $changedByUserId): Visit
    {
        $allowedNext = self::ALLOWED_TRANSITIONS[$visit->status] ?? [];

        if (! in_array($newStage, $allowedNext, true)) {
            throw new InvalidArgumentException(
                "Tidak bisa pindah dari status '{$visit->status}' ke '{$newStage}'."
            );
        }

        $updatedVisit = $this->visitRepository->updateStatus($visit, $newStage);

        VisitStageLog::create([
            'visit_id' => $visit->id,
            'changed_by' => $changedByUserId,
            'stage' => $newStage,
            'notes' => $notes,
            'created_at' => now(),
        ]);

        return $updatedVisit->fresh('stageLogs');
    }
}