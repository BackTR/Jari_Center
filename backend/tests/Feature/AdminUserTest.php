<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): array
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        return [$admin, $admin->createToken('t')->plainTextToken];
    }

    public function test_store_user_persists_role_and_facility(): void
    {
        [$admin, $token] = $this->admin();
        $facility = Facility::factory()->create();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/users', [
                'name' => 'Dokter Baru',
                'email' => 'dok@test.local',
                'password' => 'rahasia123',
                'role' => 'dokter',
                'facility_id' => $facility->id,
            ])
            ->assertStatus(201);

        $created = User::where('email', 'dok@test.local')->first();

        $this->assertSame('dokter', $created->role);
        $this->assertSame($facility->id, $created->facility_id);
        $this->assertTrue((bool) $created->is_active);
    }

    public function test_store_user_accepts_facility_admin(): void
    {
        [$admin, $token] = $this->admin();
        $facility = Facility::factory()->create();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/users', [
                'name' => 'Admin Faskes',
                'email' => 'af@test.local',
                'password' => 'rahasia123',
                'role' => 'facility_admin',
                'facility_id' => $facility->id,
            ])
            ->assertStatus(201);

        $this->assertSame('facility_admin', User::where('email', 'af@test.local')->first()->role);
    }

    public function test_store_user_rejects_role_outside_db_enum(): void
    {
        [$admin, $token] = $this->admin();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/users', [
                'name' => 'Perawat', 'email' => 'p@test.local',
                'password' => 'rahasia123', 'role' => 'perawat',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('role');
    }

    public function test_store_user_requires_facility_for_scoped_role(): void
    {
        [$admin, $token] = $this->admin();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/users', [
                'name' => 'Dokter', 'email' => 'd2@test.local',
                'password' => 'rahasia123', 'role' => 'dokter',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('facility_id');
    }

    public function test_update_user_can_change_role_and_status(): void
    {
        [$admin, $token] = $this->admin();
        $target = User::factory()->create(['role' => 'petugas_registrasi', 'is_active' => true]);
        $facility = Facility::factory()->create();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/admin/users/{$target->id}", [
                'role' => 'dokter',
                'facility_id' => $facility->id,
                'is_active' => false,
            ])
            ->assertStatus(200);

        $target->refresh();

        $this->assertSame('dokter', $target->role);
        $this->assertSame($facility->id, $target->facility_id);
        $this->assertFalse((bool) $target->is_active);
    }
}
