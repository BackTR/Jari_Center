<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Polyclinic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PolyclinicController extends Controller
{
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

        $polyclinics = Polyclinic::where('facility_id', $facilityId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'facility_id', 'name', 'code', 'is_active']);

        return response()->json(['data' => $polyclinics]);
    }

    private function canAccessFacility(Request $request, int $facilityId): bool
    {
        $user = $request->user();

        return $user->role === 'super_admin' || $user->facility_id === $facilityId;
    }
}
