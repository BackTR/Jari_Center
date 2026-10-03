<?php

namespace App\Http\Controllers\Api;

use App\Application\Visit\RegisterVisitUseCase;
use App\Application\Visit\UpdateVisitStageUseCase;
use App\Domain\Visit\Contracts\VisitRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterVisitRequest;
use App\Http\Requests\UpdateVisitStageRequest;
use App\Http\Resources\VisitResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;
use App\Models\Visit;

class VisitController extends Controller
{
    public function __construct(
        private readonly RegisterVisitUseCase $registerVisitUseCase,
        private readonly UpdateVisitStageUseCase $updateVisitStageUseCase,
        private readonly VisitRepositoryInterface $visitRepository,
    ) {
    }

    public function store(RegisterVisitRequest $request): JsonResponse
    {
        if (! $request->user()->canAccessFacility((int) $request->validated('facility_id'))) {
            return $this->forbiddenResponse();
        }

        $visit = $this->registerVisitUseCase->execute(
            $request->validated(),
            $request->user()->id,
        );

        return (new VisitResource($visit))->response()->setStatusCode(201);
    }

    public function updateStage(UpdateVisitStageRequest $request, int $visitId): JsonResponse
    {
        $visit = $this->visitRepository->findById($visitId);

        if (! $visit) {
            return response()->json(['message' => 'Kunjungan tidak ditemukan.'], 404);
        }

        if (! $request->user()->canAccessFacility($visit->facility_id)) {
            return $this->forbiddenResponse();
        }

        try {
            $updated = $this->updateVisitStageUseCase->execute(
                $visit,
                $request->validated('stage'),
                $request->validated('notes'),
                $request->user()->id,
            );
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return (new VisitResource($updated))->response();
    }

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'facility_id' => ['required', 'exists:facilities,id'],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $facilityId = (int) $request->query('facility_id');
        $date = $request->query('date', now()->toDateString());

        if (! $request->user()->canAccessFacility($facilityId)) {
            return $this->forbiddenResponse();
        }

        $visits = Visit::where('facility_id', $facilityId)
            ->whereDate('created_at', $date)
            ->with(['patient:id,jari_id,name', 'polyclinic:id,name,code', 'queue'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'data' => $visits->map(fn ($visit) => [
                'id' => $visit->id,
                'patient' => [
                    'id' => $visit->patient->id,
                    'jari_id' => $visit->patient->jari_id,
                    'name' => $visit->patient->name,
                ],
                'facility_id' => $visit->facility_id,
                'polyclinic_id' => $visit->polyclinic_id,
                'polyclinic_name' => $visit->polyclinic?->name,
                'queue_number' => $visit->queue?->queue_number,
                'status' => $visit->status,
                'payment_method' => $visit->payment_method,
                'created_at' => $visit->created_at->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $visits->currentPage(),
                'last_page' => $visits->lastPage(),
                'per_page' => $visits->perPage(),
                'total' => $visits->total(),
            ],
        ]);
    }

    public function show(Request $request, int $visitId): JsonResponse
    {
        $visit = $this->visitRepository->findById($visitId);

        if (! $visit) {
            return response()->json(['message' => 'Kunjungan tidak ditemukan.'], 404);
        }

        if (! $request->user()->canAccessFacility($visit->facility_id)) {
            return $this->forbiddenResponse();
        }

        return (new VisitResource($visit))->response();
    }

    private function forbiddenResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Anda tidak memiliki akses ke faskes ini.',
        ], 403);
    }
}