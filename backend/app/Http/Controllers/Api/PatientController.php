<?php

namespace App\Http\Controllers\Api;

use App\Application\Patient\IdentifyPatientUseCase;
use App\Application\Patient\RegisterPatientUseCase;
use App\Http\Controllers\Controller;
use App\Http\Requests\IdentifyPatientRequest;
use App\Http\Requests\StorePatientRequest;
use App\Http\Resources\PatientResource;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    public function __construct(
        private readonly RegisterPatientUseCase $registerPatientUseCase,
        private readonly IdentifyPatientUseCase $identifyPatientUseCase,
    ) {
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validated();

        // Petugas selalu mendaftarkan ke faskesnya sendiri. Super admin tidak
        // punya faskes, jadi ia harus menyebut facility_id — tanpa itu pasien
        // tercipta tanpa mapping dan tidak bisa ditemukan petugas mana pun.
        $facilityId = $user->facility_id ?? $data['facility_id'] ?? null;

        unset($data['facility_id']);

        $patient = $this->registerPatientUseCase->execute($data, $facilityId);

        return (new PatientResource($patient))
            ->response()
            ->setStatusCode(201);
    }

    public function identify(IdentifyPatientRequest $request): JsonResponse
    {
        $patients = $this->identifyPatientUseCase->execute(
            $request->validated('type'),
            $request->validated('value'),
            $request->user(),
        );

        return PatientResource::collection($patients)->response();
    }
}