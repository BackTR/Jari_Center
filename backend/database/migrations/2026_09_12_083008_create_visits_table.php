<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('facility_id')->constrained('facilities')->cascadeOnDelete();
            $table->foreignId('polyclinic_id')->nullable()->constrained('polyclinics')->nullOnDelete();
            $table->foreignId('registered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('users')->nullOnDelete();

            $table->enum('identification_method', ['jari_id', 'nik', 'fingerprint_simulation', 'qr_code', 'manual']);
            $table->enum('payment_method', ['mandiri', 'bpjs']);
            $table->string('bpjs_number')->nullable();
            $table->timestamp('bpjs_verified_at')->nullable();
            $table->string('referral_letter_number')->nullable();

            $table->enum('status', [
                'pending_verification', 'verified', 'registered', 'in_service', 'completed', 'cancelled',
            ])->default('pending_verification');

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};