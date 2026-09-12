<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Visit\Contracts\VisitRepositoryInterface;
use App\Models\Visit;

class EloquentVisitRepository implements VisitRepositoryInterface
{
    public function create(array $data): Visit
    {
        return Visit::create($data);
    }

    public function findById(int $id): ?Visit
    {
        return Visit::with(['patient', 'facility', 'polyclinic', 'stageLogs'])->find($id);
    }

    public function updateStatus(Visit $visit, string $newStatus): Visit
    {
        $visit->update(['status' => $newStatus]);

        return $visit->fresh();
    }
}