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
        if (! $request->user()->canAccessFacility($facilityId)) {
            return $this->forbiddenResponse();
        }

        $summary = $this->getFacilityDashboardUseCase->execute($facilityId, $request->query('date'));

        return response()->json(['data' => $summary]);
    }

    public function queues(Request $request, int $facilityId): JsonResponse
    {
        if (! $request->user()->canAccessFacility($facilityId)) {
            return $this->forbiddenResponse();
        }

        $polyclinicId = $request->query('polyclinic_id') ? (int) $request->query('polyclinic_id') : null;

        $queues = $this->getFacilityQueueListUseCase->execute(
            $facilityId,
            $polyclinicId,
            $request->query('date'),
        );

        // visit_status (bukan "status"): antrean tidak punya tahap sendiri,
        // tahapnya adalah tahap kunjungan.
        $data = $queues->map(fn ($queue) => [
            'id' => $queue->id,
            'visit_id' => $queue->visit_id,
            'queue_number' => $queue->queue_number,
            'visit_status' => $queue->currentStatus(),
            'polyclinic' => $queue->polyclinic?->name,
            'patient' => [
                'jari_id' => $queue->patient->jari_id,
                'name' => $queue->patient->name,
            ],
        ]);

        return response()->json(['data' => $data]);
    }

    private function forbiddenResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Anda tidak memiliki akses ke faskes ini.',
        ], 403);
    }
}