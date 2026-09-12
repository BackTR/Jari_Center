<?php

namespace App\Http\Controllers\Api;

use App\Application\Facility\GetFacilityDashboardUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly GetFacilityDashboardUseCase $getFacilityDashboardUseCase,
    ) {
    }

    public function show(Request $request, int $facilityId): JsonResponse
    {
        $user = $request->user();

        $isSuperAdmin = $user->role === 'super_admin';
        $isSameFacility = $user->facility_id === $facilityId;

        if (! $isSuperAdmin && ! $isSameFacility) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke dashboard faskes ini.',
            ], 403);
        }

        $date = $request->query('date');

        $summary = $this->getFacilityDashboardUseCase->execute($facilityId, $date);

        return response()->json(['data' => $summary]);
    }
}