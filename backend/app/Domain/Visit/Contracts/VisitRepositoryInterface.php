<?php

namespace App\Domain\Visit\Contracts;

use App\Models\Visit;

interface VisitRepositoryInterface
{
    public function create(array $data): Visit;

    public function findById(int $id): ?Visit;

    public function updateStatus(Visit $visit, string $newStatus): Visit;
}