<?php

namespace App\Http\Controllers\Api;

use App\Application\Facility\GetFacilityDashboardUseCase;
use App\Application\Visit\GetFacilityQueueListUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly GetFacilityDashboardUseCase $getFacilityDashboardUseCase,
        private readonly GetFacilityQueueListUseCase $getFacilityQueueListUseCase,
    ) {
    }

    public function show(Request $request, int $facilityId): JsonResponse
    {
        if (! $this->canAccessFacility($request, $facilityId)) {
            return $this->forbiddenResponse();
        }

        $summary = $this->getFacilityDashboardUseCase->execute($facilityId, $request->query('date'));

        return response()->json(['data' => $summary]);
    }

    public function queues(Request $request, int $facilityId): JsonResponse
    {
        if (! $this->canAccessFacility($request, $facilityId)) {
            return $this->forbiddenResponse();
        }

        $polyclinicId = $request->query('polyclinic_id') ? (int) $request->query('polyclinic_id') : null;

        $queues = $this->getFacilityQueueListUseCase->execute(
            $facilityId,
            $polyclinicId,
            $request->query('date'),
        );

        $data = $queues->map(fn ($queue) => [
            'id' => $queue->id,
            'queue_number' => $queue->queue_number,
            'status' => $queue->status,
            'polyclinic' => $queue->polyclinic?->name,
            'patient' => [
                'jari_id' => $queue->patient->jari_id,
                'name' => $queue->patient->name,
            ],
            'called_at' => $queue->called_at?->toIso8601String(),
        ]);

        return response()->json(['data' => $data]);
    }

    private function canAccessFacility(Request $request, int $facilityId): bool
    {
        $user = $request->user();

        return $user->role === 'super_admin' || $user->facility_id === $facilityId;
    }

    private function forbiddenResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Anda tidak memiliki akses ke faskes ini.',
        ], 403);
    }
}