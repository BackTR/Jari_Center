<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            $table->enum('status', ['waiting', 'called', 'in_service', 'done', 'skipped'])->default('waiting');
            $table->timestamp('called_at')->nullable();
            $table->timestamps();

            $table->unique(['facility_id', 'polyclinic_id', 'queue_date', 'queue_number'], 'unique_queue_per_day');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};