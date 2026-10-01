<?php

namespace App\Http\Controllers\Api;

use App\Application\Visit\GetFacilityQueueListUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function __construct(
        private readonly GetFacilityQueueListUseCase $getFacilityQueueListUseCase,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'facility_id' => ['required', 'exists:facilities,id'],
        ]);

        $facilityId = (int) $request->query('facility_id');

        // Check facility access
        if (! $this->canAccessFacility($request, $facilityId)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke faskes ini.',
            ], 403);
        }

        $polyclinicId = $request->query('polyclinic_id') ? (int) $request->query('polyclinic_id') : null;
        $date = $request->query('date', now()->toDateString());

        $queues = $this->getFacilityQueueListUseCase->execute($facilityId, $polyclinicId, $date);

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
}
