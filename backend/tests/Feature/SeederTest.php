<?php

namespace Tests\Feature;

use App\Models\Polyclinic;
use App\Models\Queue;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_produces_demo_dashboard_data(): void
    {
        Artisan::call('db:seed', ['--force' => true]);

        $petugas = User::where('email', 'andi@jaricenter.test')->firstOrFail();
        $facilityId = $petugas->facility_id;

        $this->assertGreaterThan(0, Polyclinic::where('facility_id', $facilityId)->count());
        $this->assertSame(4, Polyclinic::count() / \App\Models\Facility::count());

        $summary = $this->withHeader('Authorization', 'Bearer ' . $petugas->createToken('t')->plainTextToken)
            ->getJson("/api/facilities/{$facilityId}/dashboard")
            ->assertStatus(200)
            ->json('data');

        $this->assertGreaterThan(0, $summary['total_visits_today']);
        $this->assertNotEmpty($summary['recent_visits']);

        $queues = $this->withHeader('Authorization', 'Bearer ' . $petugas->createToken('t')->plainTextToken)
            ->getJson("/api/facilities/{$facilityId}/queues")
            ->assertStatus(200)
            ->json('data');

        $this->assertNotEmpty($queues);
        $this->assertNotNull($queues[0]['visit_id'], 'Queue harus tertaut ke visit.');
    }

    public function test_seed_is_idempotent(): void
    {
        Artisan::call('db:seed', ['--force' => true]);
        $visits = \App\Models\Visit::count();

        Artisan::call('db:seed', ['--force' => true]);

        $this->assertSame($visits, \App\Models\Visit::count(), 'db:seed dua kali tidak boleh duplikat.');
    }

    public function test_queue_status_comes_from_visit_stage(): void
    {
        Artisan::call('db:seed', ['--force' => true]);

        $petugas = User::where('email', 'andi@jaricenter.test')->firstOrFail();
        $facilityId = $petugas->facility_id;

        $token = $petugas->createToken('t')->plainTextToken;

        $queues = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/facilities/{$facilityId}/queues")
            ->assertStatus(200)
            ->json('data');

        $this->assertNotEmpty($queues);

        // visits.status adalah satu-satunya sumber kebenaran; API tidak lagi
        // menyimpan tahap sendiri di tabel queues.
        foreach ($queues as $queue) {
            $this->assertArrayHasKey('visit_status', $queue);
            $this->assertArrayNotHasKey('status', $queue);
            $this->assertArrayNotHasKey('called_at', $queue);

            $visit = \App\Models\Visit::findOrFail($queue['visit_id']);

            $this->assertSame($visit->status, $queue['visit_status']);
        }
    }
}
