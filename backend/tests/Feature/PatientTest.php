<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use App\Models\Facility;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientTest extends TestCase
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

    public function test_create_patient_success(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/patients', [
                'nik' => '3175010101680001',
                'name' => 'Siti Aminah',
                'date_of_birth' => '1968-05-12',
                'gender' => 'female',
                'address' => 'Jl. Merdeka No. 10',
                'phone' => '081234567890',
                'insurance_provider' => 'BPJS',
                'insurance_number' => '0001234567890',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'jari_id',
                    'nik',
                    'name',
                    'date_of_birth',
                    'gender',
                    'address',
                    'phone',
                    'insurance_provider',
                    'insurance_number',
                    'created_at',
                ],
            ]);

        $this->assertDatabaseHas('patients', [
            'nik' => '3175010101680001',
            'name' => 'Siti Aminah',
        ]);
    }

    public function test_create_patient_validation_error(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/patients', [
                'name' => '',
                'date_of_birth' => '',
                'gender' => '',
            ]);

        $response->assertStatus(422);
    }

    public function test_identify_patient_by_nik(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $patient = Patient::factory()->create([
            'nik' => '3175010101680001',
            'name' => 'Siti Aminah',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/patients/identify?type=nik&value=3175010101680001');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'nik' => '3175010101680001',
                'name' => 'Siti Aminah',
            ]);
    }

    public function test_identify_patient_not_found(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/patients/identify?type=nik&value=9999999999999999');

        $response->assertStatus(200)
            ->assertJson(['data' => []]);
    }

    public function test_create_patient_unauthenticated(): void
    {
        $response = $this->postJson('/api/patients', [
            'name' => 'Siti Aminah',
            'date_of_birth' => '1968-05-12',
            'gender' => 'female',
        ]);

        $response->assertStatus(401);
    }
}
