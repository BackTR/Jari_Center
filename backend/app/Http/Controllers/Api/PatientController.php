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
        $patient = $this->registerPatientUseCase->execute($request->validated());

        return (new PatientResource($patient))
            ->response()
            ->setStatusCode(201);
    }

    public function identify(IdentifyPatientRequest $request): JsonResponse
    {
        $patients = $this->identifyPatientUseCase->execute(
            $request->validated('type'),
            $request->validated('value'),
        );

        return PatientResource::collection($patients)->response();
    }
}