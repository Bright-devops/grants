<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigrateSensitiveDocumentsToPrivateStorage extends Command
{
    /**
     * php artisan documents:secure
     * php artisan documents:secure --dry-run
     */
    protected $signature = 'documents:secure {--dry-run : List what would move without touching any files}';

    protected $description = 'Move KYC documents, payment proofs, and invoice PDFs from the public disk to the private disk (run once after upgrading to secure document storage)';

    /**
     * These folders hold sensitive documents. Relative paths inside them are
     * unchanged by the move — only the disk root differs ('app/public' vs
     * 'app/private') — so no database updates are needed.
     */
    protected array $foldersToMigrate = ['kyc', 'payments', 'invoices'];

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        if ($dryRun) {
            $this->comment('Dry run — no files will be moved.');
        }

        $totalMoved = 0;
        $totalSkipped = 0;
        $totalFailed = 0;

        foreach ($this->foldersToMigrate as $folder) {
            $files = Storage::disk('public')->allFiles($folder);

            if (empty($files)) {
                $this->line("No files found under public/{$folder} — nothing to do.");
                continue;
            }

            $this->info(sprintf('Found %d file(s) under public/%s', count($files), $folder));

            foreach ($files as $file) {
                if (Storage::disk('local')->exists($file)) {
                    $this->line("  SKIP (already exists on private disk): {$file}");
                    $totalSkipped++;
                    continue;
                }

                if ($dryRun) {
                    $this->line("  WOULD MOVE: {$file}");
                    continue;
                }

                try {
                    $contents = Storage::disk('public')->readStream($file);

                    if ($contents === false || $contents === null) {
                        throw new \RuntimeException('Could not open source file for reading.');
                    }

                    Storage::disk('local')->put($file, $contents);

                    if (is_resource($contents)) {
                        fclose($contents);
                    }

                    // Verify the copy landed correctly before deleting the original.
                    if (
                        Storage::disk('local')->exists($file)
                        && Storage::disk('local')->size($file) === Storage::disk('public')->size($file)
                    ) {
                        Storage::disk('public')->delete($file);
                        $this->line("  MOVED: {$file}");
                        $totalMoved++;
                    } else {
                        throw new \RuntimeException('Size mismatch after copy — original left in place.');
                    }
                } catch (\Throwable $e) {
                    $this->error("  FAILED: {$file} — {$e->getMessage()}");
                    $totalFailed++;
                }
            }
        }

        $this->newLine();
        $this->info("Done. Moved: {$totalMoved}, Skipped (already private): {$totalSkipped}, Failed: {$totalFailed}");

        if ($totalFailed > 0) {
            $this->warn('Some files failed to migrate — re-run the command after investigating, the originals were left in place on the public disk.');

            return self::FAILURE;
        }

        if (! $dryRun && $totalMoved > 0) {
            $this->comment('Tip: run "php artisan documents:secure --dry-run" again to confirm the public disk is now clean.');
        }

        return self::SUCCESS;
    }
}
