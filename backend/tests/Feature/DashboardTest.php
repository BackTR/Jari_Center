<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Facility;
use App\Models\Visit;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Facility $facility;

    protected function setUp(): void
    {
        parent::setUp();

        $this->facility = Facility::factory()->create();
        $this->user = User::factory()->create([
            'facility_id' => $this->facility->id,
            'role' => 'petugas_registrasi',
        ]);
    }

    public function test_get_dashboard_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $patient = Patient::factory()->create();
        Visit::factory()->count(3)->create([
            'facility_id' => $this->facility->id,
            'patient_id' => $patient->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/facilities/{$this->facility->id}/dashboard");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'date',
                    'total_visits_today',
                    'by_status',
                    'by_payment_method',
                    'recent_visits',
                ],
            ]);
    }

    public function test_get_dashboard_forbidden(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $otherFacility = Facility::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/facilities/{$otherFacility->id}/dashboard");

        $response->assertStatus(403);
    }

    public function test_get_queues_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/facilities/{$this->facility->id}/queues");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_get_queues_forbidden(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $otherFacility = Facility::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/facilities/{$otherFacility->id}/queues");

        $response->assertStatus(403);
    }

    public function test_super_admin_can_access_all_facilities(): void
    {
        $superAdmin = User::factory()->create([
            'role' => 'super_admin',
        ]);

        $token = $superAdmin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/facilities/{$this->facility->id}/dashboard");

        $response->assertStatus(200);
    }
}
