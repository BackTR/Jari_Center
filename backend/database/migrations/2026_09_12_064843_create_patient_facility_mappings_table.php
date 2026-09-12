<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_facility_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('facility_id')->constrained('facilities')->cascadeOnDelete();
            $table->string('medical_record_number');
            $table->timestamps();

            // 1 pasien cuma boleh punya 1 nomor RM per faskes
            $table->unique(['patient_id', 'facility_id'], 'pfm_patient_facility_unique');
            // 1 nomor RM di faskes tertentu cuma boleh milik 1 pasien
            $table->unique(['facility_id', 'medical_record_number'], 'pfm_facility_mrn_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_facility_mappings');
    }
};