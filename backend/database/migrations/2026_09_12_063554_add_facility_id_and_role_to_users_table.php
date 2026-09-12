<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('facility_id')->nullable()->after('id')->constrained('facilities')->nullOnDelete();
            $table->enum('role', ['super_admin', 'facility_admin', 'petugas_registrasi', 'dokter'])->default('petugas_registrasi')->after('password');
            $table->boolean('is_active')->default(true)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['facility_id']);
            $table->dropColumn(['facility_id', 'role', 'is_active']);
        });
    }
};