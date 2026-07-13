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
        Schema::table('grant_applications', function (Blueprint $table) {
            $table->enum('payment_status', ['not_paid', 'pending_confirmation', 'confirmed'])
                ->default('not_paid')
                ->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('grant_applications', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });
    }
};