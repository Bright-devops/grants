<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Invoice;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Withdrawals/Index', [
            // whereHas('user') excludes withdrawals whose owning account was
            // deleted (soft or hard) — same guard as KycController/WalletController.
            'withdrawals' => Withdrawal::whereHas('user')
                ->with('user:id,name,email')
                ->latest()
                ->get(),
        ]);
    }

    public function approve(Withdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->fee_status === 'not_paid' || $withdrawal->fee_status === 'pending_confirmation') {
            return back()->with('error', 'The outstanding grant fee on this withdrawal must be confirmed before it can be processed.');
        }

        $withdrawal->update(['status' => 'processing']);

        $withdrawal->user->notify(new \App\Notifications\WithdrawalStatusNotification($withdrawal));

        ActivityLog::log('withdrawal.approved', $withdrawal);

        return back()->with('success', 'Withdrawal approved and marked processing.');
    }

    public function markPaid(Withdrawal $withdrawal): RedirectResponse
    {
        $withdrawal->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        $invoiceNumber = 'INV-' . now()->format('Y') . '-' . strtoupper(Str::random(6));

        $pdf = Pdf::loadView('invoices.withdrawal', [
            'withdrawal' => $withdrawal->load('user'),
            'invoiceNumber' => $invoiceNumber,
        ]);

        // Invoices carry bank/crypto destination details — keep them private.
        $pdfPath = "invoices/{$invoiceNumber}.pdf";
        Storage::disk('local')->put($pdfPath, $pdf->output());

        Invoice::create([
            'invoice_number' => $invoiceNumber,
            'withdrawal_id' => $withdrawal->id,
            'pdf_path' => $pdfPath,
        ]);

        $withdrawal->user->notify(new \App\Notifications\WithdrawalStatusNotification($withdrawal));

        ActivityLog::log('withdrawal.paid', $withdrawal);

        return back()->with('success', 'Withdrawal marked as paid and invoice generated.');
    }

    public function reject(Withdrawal $withdrawal, WalletService $walletService): RedirectResponse
    {
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', 'Only pending withdrawals can be rejected.');
        }

        $walletService->credit(
            $withdrawal->wallet,
            (float) $withdrawal->amount,
            'Withdrawal rejected — refund'
        );

        $withdrawal->update(['status' => 'rejected']);

        $withdrawal->user->notify(new \App\Notifications\WithdrawalStatusNotification($withdrawal));

        ActivityLog::log('withdrawal.rejected', $withdrawal, ['refunded_amount' => $withdrawal->amount]);

        return back()->with('success', 'Withdrawal rejected and funds refunded.');
    }
}