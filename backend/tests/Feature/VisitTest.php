<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use App\Models\Facility;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VisitTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Facility $facility;
    private Patient $patient;

    protected function setUp(): void
    {
        parent::setUp();

        $this->facility = Facility::factory()->create();
        $this->user = User::factory()->create([
            'facility_id' => $this->facility->id,
            'role' => 'petugas_registrasi',
        ]);
        $this->patient = Patient::factory()->create();
    }

    public function test_create_visit_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $this->facility->id,
                'polyclinic_id' => null,
                'identification_method' => 'nik',
                'payment_method' => 'bpjs',
                'bpjs_number' => '0001234567890',
                'referral_letter_number' => null,
                'notes' => null,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'patient',
                    'facility_id',
                    'polyclinic_id',
                    'medical_record_number',
                    'queue',
                    'identification_method',
                    'payment_method',
                    'status',
                    'stage_history',
                    'created_at',
                ],
            ]);

        $this->assertDatabaseHas('visits', [
            'patient_id' => $this->patient->id,
            'facility_id' => $this->facility->id,
            'status' => 'pending_verification',
        ]);
    }

    public function test_create_visit_validation_error(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $this->facility->id,
                'identification_method' => 'nik',
                'payment_method' => 'bpjs',
                'bpjs_number' => null,
            ]);

        $response->assertStatus(422);
    }

    public function test_get_visit_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $visit = Visit::factory()->create([
            'patient_id' => $this->patient->id,
            'facility_id' => $this->facility->id,
            'status' => 'pending_verification',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/visits/{$visit->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $visit->id,
                'status' => 'pending_verification',
            ]);
    }

    public function test_get_visit_not_found(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/visits/99999');

        $response->assertStatus(404);
    }

    public function test_update_visit_stage_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $visit = Visit::factory()->create([
            'patient_id' => $this->patient->id,
            'facility_id' => $this->facility->id,
            'status' => 'pending_verification',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/visits/{$visit->id}/stage", [
                'stage' => 'verified',
                'notes' => 'Data cocok',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'status' => 'verified',
            ]);
    }

    public function test_update_visit_stage_invalid_transition(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $visit = Visit::factory()->create([
            'patient_id' => $this->patient->id,
            'facility_id' => $this->facility->id,
            'status' => 'pending_verification',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/visits/{$visit->id}/stage", [
                'stage' => 'completed',
                'notes' => 'Loncat',
            ]);

        $response->assertStatus(422);
    }

    public function test_list_visits_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        Visit::factory()->count(3)->create([
            'facility_id' => $this->facility->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/visits?facility_id={$this->facility->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);
    }
}
