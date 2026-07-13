<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kyc;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KycController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Kyc/Index', [
            'submissions' => Kyc::with('user:id,name,email')
                ->latest()
                ->get()
                ->map(fn(Kyc $kyc) => [
                    'id' => $kyc->id,
                    'user' => $kyc->user,
                    'document_type' => $kyc->document_type,
                    'document_front_url' => Storage::url($kyc->document_front_path),
                    'document_back_url' => $kyc->document_back_path ? Storage::url($kyc->document_back_path) : null,
                    'selfie_url' => $kyc->selfie_path ? Storage::url($kyc->selfie_path) : null,
                    'status' => $kyc->status,
                    'rejection_reason' => $kyc->rejection_reason,
                    'created_at' => $kyc->created_at,
                ]),
        ]);
    }

    public function approve(Kyc $kyc): RedirectResponse
    {
        $kyc->update([
            'status' => 'approved',
            'rejection_reason' => null,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'KYC approved.');
    }

    public function reject(Request $request, Kyc $kyc): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:500'],
        ]);

        $kyc->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'KYC rejected.');
    }
}