<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = Invoice::whereHas('withdrawal', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->with('withdrawal')
            ->latest()
            ->get()
            ->map(fn (Invoice $invoice) => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'withdrawal' => $invoice->withdrawal,
                'created_at' => $invoice->created_at,
                'download_url' => route('invoices.show', $invoice),
            ]);

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Stream the invoice PDF. Financial documents live on the private disk;
     * only the withdrawal's owner or an admin may download them.
     */
    public function show(Request $request, Invoice $invoice): StreamedResponse
    {
        $invoice->loadMissing('withdrawal');
        $user = $request->user();

        abort_unless(
            $user->id === $invoice->withdrawal->user_id || $user->hasRole('admin'),
            403
        );

        abort_unless(Storage::disk('local')->exists($invoice->pdf_path), 404);

        return Storage::disk('local')->response($invoice->pdf_path, "{$invoice->invoice_number}.pdf", [
            'Cache-Control' => 'private, no-store, max-age=0',
        ]);
    }
}
