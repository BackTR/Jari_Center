<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// queues tidak punya kolom status/called_at: tahap antrean = tahap
// kunjungan (visits.status). Menyimpannya dua kali pernah membuat dashboard
// menampilkan "menunggu" untuk pasien yang sudah selesai.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('facility_id')->constrained('facilities')->cascadeOnDelete();
            $table->foreignId('polyclinic_id')->nullable()->constrained('polyclinics')->nullOnDelete();
            $table->string('queue_number');
            $table->date('queue_date');
            $table->timestamps();

            // Catatan: unique ini tidak berlaku saat polyclinic_id NULL di
            // MySQL. Nomor queue Umum dijamin lock baris faskes di
            // GenerateQueueNumberService, bukan index ini.
            $table->unique(['facility_id', 'polyclinic_id', 'queue_date', 'queue_number'], 'unique_queue_per_day');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};