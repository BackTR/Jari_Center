<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'facility_id', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /** Wajib sama persis dengan enum di migration add_facility_id_and_role_to_users_table. */
    public const ROLES = ['super_admin', 'facility_admin', 'petugas_registrasi', 'dokter'];

    public const FACILITY_SCOPED_ROLES = ['facility_admin', 'petugas_registrasi', 'dokter'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    /**
     * Super admin unrestricted; selain itu hanya faskes sendiri.
     * Satu-satunya definisi aturan ini — jangan copy-paste per controller.
     */
    public function canAccessFacility(int $facilityId): bool
    {
        return $this->role === 'super_admin' || $this->facility_id === $facilityId;
    }

    /**
     * Satu-satunya definisi "apakah pengguna ini boleh melihat pasien ini".
     * Dipakai oleh pencarian pasien DAN pencocokan sidik jari — kalau aturan
     * ini di-copy-paste, keduanya bisa berbeda diam-diam.
     */
    public function canReachPatient(Patient $patient): bool
    {
        if ($this->role === 'super_admin') {
            return true;
        }

        if ($this->facility_id === null) {
            return false;
        }

        return Patient::query()
            ->whereKey($patient->getKey())
            ->linkedToFacility($this->facility_id)
            ->exists();
    }
}
