<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use App\Models\Facility;
use App\Models\PatientFacilityMapping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class FingerprintTest extends TestCase
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
        
        // Create facility mapping for the patient
        PatientFacilityMapping::create([
            'patient_id' => $this->patient->id,
            'facility_id' => $this->facility->id,
            'medical_record_number' => 'RM000000001',
        ]);
    }

    public function test_enroll_fingerprint_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/patients/{$this->patient->id}/fingerprint/enroll", [
                'template' => 'SIMULATED_FP_TEMPLATE_SITI_AMINAH_001',
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => ['id', 'jari_id', 'name'],
            ]);
    }

    public function test_enroll_fingerprint_duplicate(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        // Create second patient with facility mapping
        $patient2 = Patient::factory()->create();
        PatientFacilityMapping::create([
            'patient_id' => $patient2->id,
            'facility_id' => $this->facility->id,
            'medical_record_number' => 'RM000000002',
        ]);

        // First enroll for patient 1
        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/patients/{$this->patient->id}/fingerprint/enroll", [
                'template' => 'SIMULATED_FP_TEMPLATE_SITI_AMINAH_001',
            ]);

        // Second enroll with same template for patient 2 - should fail
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/patients/{$patient2->id}/fingerprint/enroll", [
                'template' => 'SIMULATED_FP_TEMPLATE_SITI_AMINAH_001',
            ]);

        $response->assertStatus(409);
    }

    public function test_match_fingerprint_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        // Enroll first
        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/patients/{$this->patient->id}/fingerprint/enroll", [
                'template' => 'SIMULATED_FP_TEMPLATE_SITI_AMINAH_001',
            ]);

        // Match
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/fingerprint/match', [
                'template' => 'SIMULATED_FP_TEMPLATE_SITI_AMINAH_001',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'matched' => true,
                'message' => 'Pasien teridentifikasi.',
            ]);
    }

    public function test_match_fingerprint_not_found(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/fingerprint/match', [
                'template' => 'NON_EXISTENT_TEMPLATE',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'matched' => false,
                'message' => 'Sidik jari tidak cocok dengan data pasien manapun.',
            ]);
    }

    public function test_match_hides_existence_of_other_facility_patient(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/patients/{$this->patient->id}/fingerprint/enroll", [
                'template' => 'SIMULATED_FP_TEMPLATE_SITI_AMINAH_001',
            ]);

        Auth::forgetGuards();

        $otherFacility = Facility::factory()->create();
        $otherUser = User::factory()->create([
            'facility_id' => $otherFacility->id,
            'role' => 'petugas_registrasi',
        ]);

        $denied = $this->withHeader('Authorization', 'Bearer ' . $otherUser->createToken('t')->plainTextToken)
            ->postJson('/api/fingerprint/match', [
                'template' => 'SIMULATED_FP_TEMPLATE_SITI_AMINAH_001',
            ]);

        $unknown = $this->postJson('/api/fingerprint/match', [
            'template' => 'TEMPLATE_YANG_TIDAK_ADA',
        ]);

        // Balasannya harus identik, kalau tidak pemanggil bisa menebak
        // sidik jari itu milik pasien mana.
        $denied->assertStatus(200);
        $this->assertSame(
            $unknown->json(),
            $denied->json(),
            'Unauthorized match harus identik dengan no-match.'
        );
    }

    public function test_enroll_fingerprint_patient_not_found(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/patients/99999/fingerprint/enroll', [
                'template' => 'SIMULATED_FP_TEMPLATE',
            ]);

        $response->assertStatus(404);
    }
}
