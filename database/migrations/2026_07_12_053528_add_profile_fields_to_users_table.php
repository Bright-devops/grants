<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('country')->nullable()->after('email');
            $table->string('whatsapp')->nullable()->after('country');
            $table->enum('status', ['active', 'suspended', 'banned'])->default('active')->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'country', 'whatsapp', 'status']);
        });
    }
};
