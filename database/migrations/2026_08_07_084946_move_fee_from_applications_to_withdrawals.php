<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The grant plan's application_fee is now collected at withdrawal time
     * instead of application time.
     *
     * - grant_applications.fee_amount / fee_paid_at: snapshots the fee owed
     *   at the moment a grant is disbursed (so later changes to the plan's
     *   fee don't retroactively change what a given user already owes), and
     *   tracks whether that fee has since been collected.
     * - withdrawals.fee_amount / fee_status: snapshots the total outstanding
     *   fee at the moment a withdrawal is requested, and tracks the same
     *   submit-proof → admin-confirms cycle that used to gate applications,
     *   now gating withdrawal processing instead.
     * - payments.withdrawal_id: a payment can now be proof of an application
     *   fee (legacy) OR a withdrawal fee — exactly one of grant_application_id
     *   / withdrawal_id will be set on any given payment going forward.
     */
    public function up(): void
    {
        Schema::table('grant_applications', function (Blueprint $table) {
            $table->decimal('fee_amount', 10, 2)->nullable()->after('requested_amount');
            $table->timestamp('fee_paid_at')->nullable()->after('fee_amount');
        });

        Schema::table('withdrawals', function (Blueprint $table) {
            $table->decimal('fee_amount', 10, 2)->default(0)->after('amount');
            $table->enum('fee_status', ['not_required', 'not_paid', 'pending_confirmation', 'confirmed'])
                ->default('not_required')
                ->after('fee_amount');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('withdrawal_id')->nullable()->after('grant_application_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('grant_applications', function (Blueprint $table) {
            $table->dropColumn(['fee_amount', 'fee_paid_at']);
        });

        Schema::table('withdrawals', function (Blueprint $table) {
            $table->dropColumn(['fee_amount', 'fee_status']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('withdrawal_id');
        });
    }
};