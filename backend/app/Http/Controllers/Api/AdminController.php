<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Facility;
use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $totalPatients = Patient::count();
        $totalVisitsToday = Visit::whereDate('created_at', today())->count();
        $totalFacilities = Facility::where('is_active', true)->count();
        $totalUsers = User::where('is_active', true)->count();

        // Grafik kunjungan 7 hari terakhir
        $visitsLast7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $visitsLast7Days[] = [
                'date' => $date->format('Y-m-d'),
                'total' => Visit::whereDate('created_at', $date)->count(),
            ];
        }

        // Grafik pasien baru 7 hari terakhir
        $patientsLast7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $patientsLast7Days[] = [
                'date' => $date->format('Y-m-d'),
                'total' => Patient::whereDate('created_at', $date)->count(),
            ];
        }

        return response()->json([
            'data' => [
                'total_patients' => $totalPatients,
                'total_visits_today' => $totalVisitsToday,
                'total_facilities' => $totalFacilities,
                'total_users' => $totalUsers,
                'visits_last_7_days' => $visitsLast7Days,
                'patients_last_7_days' => $patientsLast7Days,
            ],
        ]);
    }

    public function facilities(): JsonResponse
    {
        $facilities = Facility::withCount(['users', 'visits'])
            ->orderBy('name')
            ->paginate(20);

        return response()->json([
            'data' => $facilities->map(fn ($facility) => [
                'id' => $facility->id,
                'name' => $facility->name,
                'type' => $facility->type,
                'code' => $facility->code,
                'address' => $facility->address,
                'phone' => $facility->phone,
                'is_active' => $facility->is_active,
                'users_count' => $facility->users_count,
                'visits_count' => $facility->visits_count,
                'created_at' => $facility->created_at->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $facilities->currentPage(),
                'last_page' => $facilities->lastPage(),
                'per_page' => $facilities->perPage(),
                'total' => $facilities->total(),
            ],
        ]);
    }

    public function storeFacility(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:hospital,clinic,puskesmas'],
            'code' => ['required', 'string', 'unique:facilities,code'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $facility = Facility::create($validated);

        return response()->json([
            'message' => 'Faskes berhasil ditambahkan.',
            'data' => $facility,
        ], 201);
    }

    public function updateFacility(Request $request, int $id): JsonResponse
    {
        $facility = Facility::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'in:hospital,clinic,puskesmas'],
            'code' => ['sometimes', 'string', 'unique:facilities,code,' . $id],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $facility->update($validated);

        return response()->json([
            'message' => 'Faskes berhasil diperbarui.',
            'data' => $facility,
        ]);
    }

    public function users(): JsonResponse
    {
        $users = User::with('facility')
            ->orderBy('name')
            ->paginate(20);

        return response()->json([
            'data' => $users->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'facility_id' => $user->facility_id,
                'facility_name' => $user->facility?->name,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:'.implode(',', User::ROLES)],
            'facility_id' => ['required_if:role,'.implode(',', User::FACILITY_SCOPED_ROLES), 'exists:facilities,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'facility_id' => $validated['facility_id'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'User berhasil ditambahkan.',
            'data' => $user,
        ], 201);
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $id],
            'role' => ['sometimes', 'in:'.implode(',', User::ROLES)],
            'facility_id' => ['sometimes', 'required_if:role,'.implode(',', User::FACILITY_SCOPED_ROLES), 'exists:facilities,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User berhasil diperbarui.',
            'data' => $user,
        ]);
    }

    public function resetPassword(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password berhasil direset.',
        ]);
    }

    public function activities(): JsonResponse
    {
        // ponytail: belum ada tabel audit, jadi selalu kosong. Hapus endpoint ini
        // (dan route + nav item) sampai activity logging benar-benar dikerjakan.
        return response()->json([
            'data' => [],
            'meta' => [
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 20,
                'total' => 0,
            ],
        ]);
    }
}
