<?php

namespace App\Console\Commands;

use App\Models\Kyc; // confirmed table: kycs
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

/**
 * php artisan kyc:audit-missing-files
 * php artisan kyc:audit-missing-files --flag
 * php artisan kyc:audit-missing-files --disk=local --export=missing.csv
 *
 * Confirmed schema (SHOW COLUMNS FROM kycs):
 *  id, user_id, document_type, document_front_path (NOT NULL),
 *  document_back_path (nullable — legitimately empty for passport-type docs),
 *  selfie_path (nullable), status enum('pending','approved','rejected'),
 *  rejection_reason, reviewed_at, created_at, updated_at, deleted_at (soft deletes)
 *
 * Paths stored relative to disk root, e.g. "kyc/6/PGvRyXg3QmAjtB6EL6LtTfmxkagkRrsKj1Q30c8k.jpg"
 * The folder number in the path is user_id (confirmed), not kycs.id.
 * Files live on the 'local' disk pointing at storage/app/private.
 *
 * --flag sets status = 'rejected' with a rejection_reason explaining the missing
 * files, reusing the existing review workflow instead of adding a new column.
 * Check what actually fires on that status transition (email/notification) before running.
 */
class AuditKycFiles extends Command
{
    protected $signature = 'kyc:audit-missing-files
        {--disk=local : Filesystem disk to check against}
        {--flag : Mark affected records needs_resubmission = true}
        {--export= : Optional CSV filename to write results to (in storage/app)}';

    protected $description = 'Cross-reference KYC submission DB records against files actually present on disk';

    public function handle(): int
    {
        $disk = $this->option('disk');
        $shouldFlag = $this->option('flag');
        $exportPath = $this->option('export');

        if (!Storage::disk($disk)->exists('kyc')) {
            $this->error("Disk [$disk] has no 'kyc' directory at its root — check --disk or your disk config.");
            return self::FAILURE;
        }

        $fileFields = [
            'document_front_path' => 'Front ID',
            'document_back_path'  => 'Back ID',
            'selfie_path'         => 'Selfie',
        ];

        $submissions = Kyc::query()->withTrashed()->get();

        if ($submissions->isEmpty()) {
            $this->warn('No Kyc records found — nothing to audit.');
            return self::SUCCESS;
        }

        $rows = [];
        $missingCount = 0;
        $toFlag = [];

        $this->info("Auditing {$submissions->count()} submissions against disk [$disk]...");
        $bar = $this->output->createProgressBar($submissions->count());
        $bar->start();

        foreach ($submissions as $submission) {
            $missingForThisRecord = [];

            foreach ($fileFields as $field => $label) {
                $path = $submission->{$field};

                // Nullable fields (back_path, selfie_path) with no path in DB are
                // schema-legitimate — e.g. passport-type submissions have no back image.
                // Only front_id_path being empty is a real anomaly (it's NOT NULL in schema).
                if (empty($path)) {
                    if ($field === 'document_front_path') {
                        $missingForThisRecord[] = "$label (empty despite NOT NULL constraint — check row directly)";
                    }
                    continue;
                }

                if (!Storage::disk($disk)->exists($path)) {
                    $missingForThisRecord[] = "$label (path set, file absent)";
                }
            }

            if (!empty($missingForThisRecord)) {
                $missingCount++;
                $toFlag[] = $submission->id;

                $rows[] = [
                    $submission->id,
                    $submission->user_id ?? '—',
                    optional($submission->user)->email ?? '—',
                    implode(', ', $missingForThisRecord),
                ];
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        if ($missingCount === 0) {
            $this->info('✔ No discrepancies found. Every DB record has all its files on disk.');
            return self::SUCCESS;
        }

        $this->warn("Found {$missingCount} record(s) with missing/incomplete files:");
        $this->table(['ID', 'User ID', 'Email', 'Missing'], $rows);

        if ($exportPath) {
            $csv = "id,user_id,email,missing\n";
            foreach ($rows as $row) {
                $csv .= implode(',', array_map(
                    fn ($v) => '"' . str_replace('"', '""', $v) . '"',
                    $row
                )) . "\n";
            }
            Storage::disk('local')->put($exportPath, $csv);
            $this->info("Exported to storage/app/{$exportPath}");
        }

        if ($shouldFlag) {
            if ($this->confirm("Flag all {$missingCount} affected records with needs_resubmission = true?", true)) {
                Kyc::whereIn('id', $toFlag)->update(['needs_resubmission' => true]);
                $this->info("Flagged {$missingCount} record(s).");
            }
        } else {
            $this->line('Run again with --flag to mark these records for resubmission.');
        }

        return self::SUCCESS;
    }
}