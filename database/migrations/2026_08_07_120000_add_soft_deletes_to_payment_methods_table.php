<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * payment_methods can't be hard-deleted once a payment references them
     * (FK constraint). Soft-deleting lets admins "remove" a method from the
     * active list while keeping the row around for old payments to point
     * to. Any payments still pointing at a retired method get reassigned to
     * another active method at the point of deletion — see
     * Admin\PaymentMethodController::destroy().
     */
    public function up(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
