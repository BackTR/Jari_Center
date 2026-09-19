<?php

namespace App\Http\Controllers\Api;

use App\Application\Patient\EnrollFingerprintUseCase;
use App\Application\Patient\MatchFingerprintUseCase;
use App\Http\Controllers\Controller;
use App\Http\Requests\FingerprintTemplateRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class FingerprintController extends Controller
{
    public function __construct(
        private readonly EnrollFingerprintUseCase $enrollFingerprintUseCase,
        private readonly MatchFingerprintUseCase $matchFingerprintUseCase,
    ) {
    }

    public function enroll(FingerprintTemplateRequest $request, int $patientId): JsonResponse
    {
        $patient = Patient::find($patientId);

        if (! $patient) {
            return response()->json(['message' => 'Pasien tidak ditemukan.'], 404);
        }

        try {
            $updated = $this->enrollFingerprintUseCase->execute(
                $patient,
                $request->validated('template'),
            );
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'message' => 'Sidik jari berhasil didaftarkan (simulasi).',
            'data' => new PatientResource($updated),
        ]);
    }

    public function match(FingerprintTemplateRequest $request): JsonResponse
    {
        $patient = $this->matchFingerprintUseCase->execute(
            $request->validated('template'),
        );

        if (! $patient) {
            return response()->json([
                'matched' => false,
                'message' => 'Sidik jari tidak cocok dengan data pasien manapun.',
                'data' => null,
            ], 200);
        }

        return response()->json([
            'matched' => true,
            'message' => 'Pasien teridentifikasi.',
            'data' => new PatientResource($patient),
        ]);
    }
}