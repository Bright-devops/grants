<?php

namespace App\Console\Commands;

use App\Models\Kyc;
use App\Models\User;
use App\Services\UserDeletionService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

/**
 * php artisan app:purge-soft-deleted
 * php artisan app:purge-soft-deleted --dry-run
 *
 * One-off cleanup for rows that were soft-deleted BEFORE
 * UserController/KycController were switched over to permanent deletes.
 * Going forward, new deletes never leave a trashed row behind, so this
 * command should only ever need to be run once against existing data
 * (or occasionally, if you ever soft-delete manually via tinker).
 *
 * Only touches `users` and `kycs` — the two tables in this app that
 * actually use SoftDeletes. payment_methods is deliberately left alone;
 * its soft delete is permanent by design (see PaymentMethodController).
 * grant_plans / testimonials are also left alone — no request was made
 * to purge those, and doing so isn't safe to bundle in silently.
 *
 * NO FINANCIAL GUARDS: every trashed user is purged unconditionally —
 * wallet balance and withdrawal status are not checked. Deleting a user
 * takes their wallet, KYC submissions (+ files), grant applications,
 * payments, and withdrawals with them, with no trace any of it existed.
 */
class PurgeSoftDeletedRecords extends Command
{
    protected $signature = 'app:purge-soft-deleted
        {--dry-run : List what would be purged without deleting anything}';

    protected $description = 'Permanently delete users and KYC submissions that are currently soft-deleted';

    public function handle(UserDeletionService $userDeletionService): int
    {
        $dryRun = $this->option('dry-run');

        $trashedUsers = User::onlyTrashed()->get();
        $trashedUserIds = $trashedUsers->pluck('id');

        $this->info("Found {$trashedUsers->count()} soft-deleted user(s).");

        $purgedUsers = 0;

        foreach ($trashedUsers as $user) {
            if ($dryRun) {
                $this->line("  [would purge] user #{$user->id} ({$user->email})");
                continue;
            }

            $userDeletionService->forceDelete($user);
            $purgedUsers++;
            $this->line("  ✔ purged user #{$user->id} ({$user->email})");
        }

        // Trashed kycs whose user is also trashed are already handled
        // above (cascaded away with their user) — don't touch them twice.
        $orphanTrashedKycs = Kyc::onlyTrashed()
            ->whereNotIn('user_id', $trashedUserIds)
            ->get();

        $this->info("Found {$orphanTrashedKycs->count()} soft-deleted KYC submission(s) not tied to a purged user.");

        $purgedKycs = 0;

        foreach ($orphanTrashedKycs as $kyc) {
            if ($dryRun) {
                $this->line("  [would purge] kyc #{$kyc->id} (user_id {$kyc->user_id})");
                continue;
            }

            foreach ([$kyc->document_front_path, $kyc->document_back_path, $kyc->selfie_path] as $path) {
                if ($path) {
                    Storage::disk('local')->delete($path);
                }
            }

            $kyc->forceDelete();
            $purgedKycs++;
            $this->line("  ✔ purged kyc #{$kyc->id}");
        }

        if ($dryRun) {
            $this->newLine();
            $this->info('Dry run — nothing was deleted. Re-run without --dry-run to actually purge.');
            return self::SUCCESS;
        }

        $this->newLine();
        $this->info("Done. Purged {$purgedUsers} user(s) and {$purgedKycs} KYC submission(s).");

        return self::SUCCESS;
    }
}