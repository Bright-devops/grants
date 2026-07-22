<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', fn(Blueprint $table) => $table->softDeletes());
        Schema::table('grant_plans', fn(Blueprint $table) => $table->softDeletes());
        Schema::table('testimonials', fn(Blueprint $table) => $table->softDeletes());
    }

    public function down(): void
    {
        Schema::table('users', fn(Blueprint $table) => $table->dropSoftDeletes());
        Schema::table('grant_plans', fn(Blueprint $table) => $table->dropSoftDeletes());
        Schema::table('testimonials', fn(Blueprint $table) => $table->dropSoftDeletes());
    }
};
