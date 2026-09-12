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

    public function show(int $visitId): JsonResponse
    {
        $visit = $this->visitRepository->findById($visitId);

        if (! $visit) {
            return response()->json(['message' => 'Kunjungan tidak ditemukan.'], 404);
        }

        return (new VisitResource($visit))->response();
    }
}