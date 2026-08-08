<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * KYC submissions are compliance-relevant records. Deleting one from the
     * admin panel soft-deletes the row (keeps an auditable trace that it
     * existed and was removed) while the underlying ID documents themselves
     * are purged immediately from disk by the controller — we don't want to
     * indefinitely retain scans of passports/IDs just because the DB row
     * is kept for audit purposes.
     */
    public function up(): void
    {
        Schema::table('kycs', fn (Blueprint $table) => $table->softDeletes());
    }

    public function down(): void
    {
        Schema::table('kycs', fn (Blueprint $table) => $table->dropSoftDeletes());
    }
};
