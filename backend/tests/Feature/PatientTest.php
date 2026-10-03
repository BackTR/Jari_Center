<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use App\Models\Facility;
use App\Models\PatientFacilityMapping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
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

        PatientFacilityMapping::create([
            'patient_id' => $patient->id,
            'facility_id' => $this->facility->id,
            'medical_record_number' => 'RM000000001',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/patients/identify?type=nik&value=3175010101680001');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'nik' => '3175010101680001',
                'name' => 'Siti Aminah',
            ]);
    }

    public function test_registered_patient_gets_mapping_and_is_findable(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/patients', [
                'nik' => '3175010101680002',
                'name' => 'Rina Wijaya',
                'date_of_birth' => '1990-02-20',
                'gender' => 'female',
            ])->assertStatus(201);

        $this->assertDatabaseHas('patient_facility_mappings', [
            'facility_id' => $this->facility->id,
        ]);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/patients/identify?type=nik&value=3175010101680002')
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Rina Wijaya']);
    }

    public function test_identify_hides_patients_from_other_facility(): void
    {
        $otherFacility = Facility::factory()->create();
        $otherUser = User::factory()->create([
            'facility_id' => $otherFacility->id,
            'role' => 'petugas_registrasi',
        ]);

        $token = $this->user->createToken('test-token')->plainTextToken;

        $patient = Patient::factory()->create(['nik' => '3175010101680003']);

        PatientFacilityMapping::create([
            'patient_id' => $patient->id,
            'facility_id' => $otherFacility->id,
            'medical_record_number' => 'RM000000002',
        ]);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/patients/identify?type=nik&value=3175010101680003')
            ->assertStatus(200)
            ->assertJson(['data' => []]);

        // Guard sanctum meng-cache user dari request sebelumnya, jadi tiap
        // pergantian token harus forgetGuards() lebih dulu.
        Auth::forgetGuards();

        $this->withHeader('Authorization', 'Bearer ' . $otherUser->createToken('t')->plainTextToken)
            ->getJson('/api/patients/identify?type=nik&value=3175010101680003')
            ->assertStatus(200)
            ->assertJsonFragment(['nik' => '3175010101680003']);
    }

    public function test_super_admin_identifies_any_patient(): void
    {
        $superAdmin = User::factory()->create([
            'facility_id' => null,
            'role' => 'super_admin',
        ]);

        Patient::factory()->create(['nik' => '3175010101680004']);

        $this->withHeader('Authorization', 'Bearer ' . $superAdmin->createToken('t')->plainTextToken)
            ->getJson('/api/patients/identify?type=nik&value=3175010101680004')
            ->assertStatus(200)
            ->assertJsonFragment(['nik' => '3175010101680004']);
    }

    public function test_identify_patient_not_found(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/patients/identify?type=nik&value=9999999999999999');

        $response->assertStatus(200)
            ->assertJson(['data' => []]);
    }

    public function test_super_admin_must_name_a_facility_when_registering(): void
    {
        $superAdmin = User::factory()->create([
            'facility_id' => null,
            'role' => 'super_admin',
        ]);

        $payload = [
            'nik' => '3175010101680009',
            'name' => 'Tanpa Faskes',
            'date_of_birth' => '1988-01-01',
            'gender' => 'male',
        ];

        // Tanpa facility_id pasien tercipta tanpa mapping — tidak bisa
        // ditemukan petugas mana pun.
        $this->withHeader('Authorization', 'Bearer ' . $superAdmin->createToken('t')->plainTextToken)
            ->postJson('/api/patients', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors('facility_id');

        $this->assertDatabaseCount('patients', 0);

        $this->withHeader('Authorization', 'Bearer ' . $superAdmin->createToken('t')->plainTextToken)
            ->postJson('/api/patients', $payload + ['facility_id' => $this->facility->id])
            ->assertStatus(201);

        $this->assertDatabaseHas('patient_facility_mappings', [
            'facility_id' => $this->facility->id,
        ]);
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
