<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Facility\Contracts\DashboardRepositoryInterface;
use App\Models\Visit;

class EloquentDashboardRepository implements DashboardRepositoryInterface
{
    public function getFacilitySummary(int $facilityId, string $date): array
    {
        $baseQuery = Visit::where('facility_id', $facilityId)
            ->whereDate('created_at', $date);

        $totalToday = (clone $baseQuery)->count();

        $byStatus = (clone $baseQuery)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $byPaymentMethod = (clone $baseQuery)
            ->selectRaw('payment_method, count(*) as total')
            ->groupBy('payment_method')
            ->pluck('total', 'payment_method');

        $recentVisits = (clone $baseQuery)
            ->with('patient:id,jari_id,name')
            ->latest()
            ->limit(10)
            ->get(['id', 'patient_id', 'status', 'payment_method', 'created_at']);

        return [
            'date' => $date,
            'total_visits_today' => $totalToday,
            'by_status' => [
                'pending_verification' => $byStatus->get('pending_verification', 0),
                'verified' => $byStatus->get('verified', 0),
                'registered' => $byStatus->get('registered', 0),
                'in_service' => $byStatus->get('in_service', 0),
                'completed' => $byStatus->get('completed', 0),
                'cancelled' => $byStatus->get('cancelled', 0),
            ],
            'by_payment_method' => [
                'mandiri' => $byPaymentMethod->get('mandiri', 0),
                'bpjs' => $byPaymentMethod->get('bpjs', 0),
            ],
            'recent_visits' => $recentVisits,
        ];
    }
}