<?php

namespace App\Http\Controllers;

use App\Models\Kyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KycDocumentController extends Controller
{
    /**
     * Stream a KYC document (front, back, or selfie).
     *
     * KYC documents are government IDs and selfies — highly sensitive PII.
     * They live on the private ('local') disk and are never exposed via a
     * public URL. Access here is restricted to the document's owner or an
     * admin, checked on every request rather than relying on the file path
     * being "hard to guess".
     */
    public function show(Request $request, Kyc $kyc, string $type): StreamedResponse
    {
        abort_unless(in_array($type, ['front', 'back', 'selfie'], true), 404);

        $user = $request->user();
        abort_unless($user->id === $kyc->user_id || $user->hasRole('admin'), 403);

        $path = match ($type) {
            'front' => $kyc->document_front_path,
            'back' => $kyc->document_back_path,
            'selfie' => $kyc->selfie_path,
        };

        abort_if(! $path, 404);
        abort_unless(Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path, null, [
            // Never let a browser or intermediary cache someone else's ID document.
            'Cache-Control' => 'private, no-store, max-age=0',
        ]);
    }
}
