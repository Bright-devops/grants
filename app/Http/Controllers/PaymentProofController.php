<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaymentProofController extends Controller
{
    /**
     * Stream a payment proof (transfer screenshot, transaction receipt, etc.).
     *
     * Stored on the private disk; only the paying user or an admin may view it.
     */
    public function show(Request $request, Payment $payment): StreamedResponse
    {
        $user = $request->user();
        abort_unless($user->id === $payment->user_id || $user->hasRole('admin'), 403);

        abort_if(empty($payment->proof_path), 404, 'No payment proof uploaded for this payment.');

        abort_unless(Storage::disk('local')->exists($payment->proof_path), 404);

        return Storage::disk('local')->response($payment->proof_path, null, [
            'Cache-Control' => 'private, no-store, max-age=0',
        ]);
    }
}
