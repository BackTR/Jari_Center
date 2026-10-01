<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Facility;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class AntrianTest extends DuskTestCase
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

    public function test_antrian_page_loads(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/antrian')
                ->assertSee('Nomor Antrian')
                ->assertSee('Antrean Pasien');
        });
    }

    public function test_antrian_page_shows_empty_state(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/antrian')
                ->assertSee('Belum ada antrean hari ini');
        });
    }

    public function test_antrian_page_has_refresh_button(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs($this->user)
                ->visit('/antrian')
                ->assertSee('Refresh');
        });
    }
}
