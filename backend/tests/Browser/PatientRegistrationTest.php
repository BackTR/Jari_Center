<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Facility;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PatientRegistrationTest extends DuskTestCase
{
    use DatabaseMigrations;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $facility = Facility::factory()->create();
        $this->user = User::factory()->create([
            'facility_id' => $facility->id,
            'role' => 'petugas_registrasi',
        ]);
    }

    public function test_patient_registration_page_loads(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/pasien/baru')
                ->assertSee('Daftarkan Pasien')
                ->assertSee('Data Identitas')
                ->assertSee('Identitas Sidik Jari');
        });
    }

    public function test_patient_registration_form_validation(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/pasien/baru')
                ->press('Simpan Pasien')
                ->waitForText('Silakan daftarkan sidik jari pasien terlebih dahulu.')
                ->assertSee('Silakan daftarkan sidik jari pasien terlebih dahulu.');
        });
    }

    public function test_fingerprint_scan_simulation(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/pasien/baru')
                ->click('button:has-text("Daftarkan Sidik Jari")')
                ->waitForText('Membaca sidik jari...')
                ->waitForText('Sidik jari berhasil didaftarkan', 5)
                ->assertSee('Sidik jari berhasil didaftarkan');
        });
    }
}
