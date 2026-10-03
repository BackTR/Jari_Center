<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use App\Models\Facility;
use App\Models\Polyclinic;
use App\Models\Queue;
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

    public function test_created_queue_persists_visit_id(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $visitId = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $this->facility->id,
                'polyclinic_id' => null,
                'identification_method' => 'nik',
                'payment_method' => 'mandiri',
            ])->json('data.id');

        $this->assertDatabaseHas('queues', [
            'visit_id' => $visitId,
            'facility_id' => $this->facility->id,
        ]);
    }

    public function test_queue_list_exposes_visit_id(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $visit = Visit::factory()->create([
            'patient_id' => $this->patient->id,
            'facility_id' => $this->facility->id,
        ]);

        Queue::create([
            'patient_id' => $this->patient->id,
            'visit_id' => $visit->id,
            'facility_id' => $this->facility->id,
            'polyclinic_id' => null,
            'queue_number' => 'U-001',
            'queue_date' => now()->toDateString(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/facilities/{$this->facility->id}/queues");

        $response->assertStatus(200)
            ->assertJsonPath('data.0.visit_id', $visit->id);
    }

    public function test_create_visit_forbidden_on_other_facility(): void
    {
        $otherFacility = Facility::factory()->create();

        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $otherFacility->id,
                'identification_method' => 'nik',
                'payment_method' => 'mandiri',
            ]);

        $response->assertStatus(403);

        $this->assertDatabaseCount('visits', 0);
        $this->assertDatabaseCount('queues', 0);
        $this->assertDatabaseCount('patient_facility_mappings', 0);
    }

    public function test_queue_numbers_are_unique_within_a_facility(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        // polyclinic_id null => queue Umum. Di MySQL UNIQUE index tidak
        // berlaku untuk NULL, jadi penomoranUMUM ini hanya aman karena lock.
        foreach (range(1, 5) as $ignored) {
            $patient = Patient::factory()->create();
            Visit::factory()->create([
                'patient_id' => $patient->id,
                'facility_id' => $this->facility->id,
                'polyclinic_id' => null,
            ]);

            $this->withHeader('Authorization', "Bearer {$token}")
                ->postJson('/api/visits', [
                    'patient_id' => $patient->id,
                    'facility_id' => $this->facility->id,
                    'polyclinic_id' => null,
                    'identification_method' => 'nik',
                    'payment_method' => 'mandiri',
                ])
                ->assertStatus(201);
        }

        $numbers = Queue::where('facility_id', $this->facility->id)->pluck('queue_number');

        $this->assertCount(5, $numbers);
        $this->assertSame($numbers->count(), $numbers->unique()->count(), 'Nomor antrean harus unik.');
    }

    public function test_queue_numbering_restarts_per_day(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        Queue::create([
            'patient_id' => $this->patient->id,
            'facility_id' => $this->facility->id,
            'polyclinic_id' => null,
            'queue_number' => 'U-001',
            'queue_date' => now()->subDay()->toDateString(),
        ]);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $this->facility->id,
                'polyclinic_id' => null,
                'identification_method' => 'nik',
                'payment_method' => 'mandiri',
            ])
            ->assertStatus(201);

        $today = Queue::whereDate('queue_date', now()->toDateString())->sole();

        $this->assertSame('U-001', $today->queue_number);
    }

    public function test_create_visit_rejects_polyclinic_from_another_facility(): void
    {
        $otherFacility = Facility::factory()->create();

        $foreignPolyclinic = Polyclinic::create([
            'facility_id' => $otherFacility->id,
            'name' => 'Poli Gigi Faskes B',
            'code' => 'GI-B',
        ]);

        $ownPolyclinic = Polyclinic::create([
            'facility_id' => $this->facility->id,
            'name' => 'Poli Umum',
            'code' => 'UM-A',
        ]);

        $token = $this->user->createToken('test-token')->plainTextToken;

        // Poliklinik faskes lain harus ditolak, kalau tidak nama & kode
        // poliklinik faskes B bocor ke dashboard/antrean faskes A.
        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $this->facility->id,
                'polyclinic_id' => $foreignPolyclinic->id,
                'identification_method' => 'nik',
                'payment_method' => 'mandiri',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('polyclinic_id');

        $this->assertDatabaseCount('visits', 0);

        // Poliklinik sendiri tetap boleh.
        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $this->facility->id,
                'polyclinic_id' => $ownPolyclinic->id,
                'identification_method' => 'nik',
                'payment_method' => 'mandiri',
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.polyclinic_id', $ownPolyclinic->id);
    }

    public function test_update_stage_forbidden_on_other_facility(): void
    {
        $otherFacility = Facility::factory()->create();

        $visit = Visit::factory()->create([
            'patient_id' => $this->patient->id,
            'facility_id' => $otherFacility->id,
            'status' => 'pending_verification',
        ]);

        $token = $this->user->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/visits/{$visit->id}/stage", [
                'stage' => 'verified',
            ])
            ->assertStatus(403);

        $this->assertDatabaseHas('visits', [
            'id' => $visit->id,
            'status' => 'pending_verification',
        ]);
    }

    public function test_super_admin_can_operate_on_any_facility(): void
    {
        $superAdmin = User::factory()->create([
            'facility_id' => null,
            'role' => 'super_admin',
        ]);

        $otherFacility = Facility::factory()->create();

        $token = $superAdmin->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/visits', [
                'patient_id' => $this->patient->id,
                'facility_id' => $otherFacility->id,
                'identification_method' => 'nik',
                'payment_method' => 'mandiri',
            ])
            ->assertStatus(201);
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
