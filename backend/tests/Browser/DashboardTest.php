<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Facility;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class DashboardTest extends DuskTestCase
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

    public function test_dashboard_page_loads(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/')
                ->assertSee('Dashboard')
                ->assertSee('Mulai Pelayanan')
                ->assertSee('Antrean Saat Ini');
        });
    }

    public function test_dashboard_statistics_visible(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/')
                ->assertSee('Pasien Hari Ini')
                ->assertSee('Sudah Dilayani')
                ->assertSee('Menunggu')
                ->assertSee('Kunjungan');
        });
    }

    public function test_quick_actions_visible(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/')
                ->assertSee('Cari Pasien')
                ->assertSee('Daftarkan Pasien')
                ->assertSee('Daftarkan Kunjungan')
                ->assertSee('Nomor Antrian');
        });
    }
}
