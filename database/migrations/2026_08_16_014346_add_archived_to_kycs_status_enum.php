<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * UserController@destroy sets a deleted user's KYC submissions to
     * 'archived' so they're unambiguous to filter out of admin views.
     * The original enum only allowed pending/approved/rejected, which
     * caused a data-truncation QueryException on user delete. Raw SQL
     * is required here because Laravel's enum column type doesn't
     * support MODIFY on existing enums without doctrine/dbal.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE kycs MODIFY status ENUM('pending', 'approved', 'rejected', 'archived') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE kycs MODIFY status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'");
    }
};