<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Kyc;
use App\Models\Payment;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserDeletionService
{
    /**
     * Permanently delete a user AND everything connected to them — wallet,
     * KYC submissions (+ files), grant applications, payments, withdrawals,
     * and invoices — in one shot, no exceptions, no blockers.
     *
     * Schema context (see database/migrations):
     *  - wallets.user_id, kycs.user_id, grant_applications.user_id,
     *    payments.user_id, withdrawals.user_id are all cascadeOnDelete.
     *  - withdrawals.wallet_id is NOT cascadeOnDelete (plain constrained(),
     *    default RESTRICT). If you just call $user->forceDelete() and let
     *    the DB cascade handle everything, MySQL cascades to `wallets`
     *    and to `withdrawals` from the same DELETE FROM users, in an
     *    order it doesn't guarantee — and if it deletes the wallet row
     *    before the withdrawal rows that still point at wallet_id, you
     *    get a 1451 "Cannot delete or update a parent row" error. So
     *    withdrawals are deleted explicitly, before the wallet, rather
     *    than left to an unordered cascade.
     *  - invoices.withdrawal_id IS cascadeOnDelete, so deleting a
     *    withdrawal takes its invoice row with it automatically — but
     *    not the invoice PDF file on disk, which is cleaned up here.
     *  - wallet_transactions cascades from wallets.
     *  - payment_methods is deliberately NOT touched here. It's shared
     *    across users and its own soft-delete exists only because
     *    payments.payment_method_id is a required FK — see
     *    PaymentMethodController@destroy. Nothing about deleting a user
     *    should ever reach that table.
     *
     * There are no guards here: wallet balance and withdrawal/application
     * status are not checked. Whatever money or history was attached to
     * this user is gone the moment this runs, with no trace it existed.
     *
     * Because most of this cascades at the DB layer, no Eloquent model
     * events fire on the cascaded rows. That means anything only
     * cleaned up in a controller (KYC files, payment proof files,
     * invoice PDFs) is handled explicitly here, or it becomes an
     * orphaned file on disk with no DB row left pointing at it.
     */
    public function forceDelete(User $user): void
    {
        // Collect every file path before anything is removed from the
        // DB — once the rows are gone we have no way to know what to
        // delete off disk.
        $kycFilePaths = Kyc::withTrashed()
            ->where('user_id', $user->id)
            ->get(['document_front_path', 'document_back_path', 'selfie_path'])
            ->flatMap(fn(Kyc $kyc) => [
                $kyc->document_front_path,
                $kyc->document_back_path,
                $kyc->selfie_path,
            ]);

        $paymentProofPaths = Payment::where('user_id', $user->id)
            ->pluck('proof_path');

        $withdrawalIds = Withdrawal::where('user_id', $user->id)->pluck('id');

        $invoicePdfPaths = $withdrawalIds->isNotEmpty()
            ? Invoice::whereIn('withdrawal_id', $withdrawalIds)->pluck('pdf_path')
            : collect();

        $filePaths = $kycFilePaths
            ->merge($paymentProofPaths)
            ->merge($invoicePdfPaths)
            ->filter()
            ->unique();

        DB::transaction(function () use ($user) {
            // Explicit forceDelete on kycs rather than relying solely on
            // the DB cascade — bypasses Eloquent's soft-delete UPDATE
            // and guarantees the row is actually gone, not just trashed.
            Kyc::withTrashed()->where('user_id', $user->id)->forceDelete();

            // Withdrawals must go before the wallet — see the docblock
            // above. Their invoices cascade away automatically via
            // invoices.withdrawal_id (cascadeOnDelete).
            Withdrawal::where('user_id', $user->id)->delete();

            // Wallet, grant applications, payments, and wallet
            // transactions are not soft-deleted models — deleting the
            // user cascades them away at the DB level. Withdrawals are
            // already gone, so the wallet delete no longer conflicts.
            $user->forceDelete();
        });

        // File cleanup only after the transaction commits — if it had
        // rolled back, the DB rows would still exist and the files
        // would need to stay too.
        foreach ($filePaths as $path) {
            Storage::disk('local')->delete($path);
        }
    }
}