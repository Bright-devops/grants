<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKycRequest;
use App\Models\Kyc;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KycController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Kyc/Index', [
            'latestKyc' => $request->user()->latestKyc,
        ]);
    }

    public function store(StoreKycRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Block a new submission while one is already pending
        if ($user->latestKyc?->status === 'pending') {
            return back()->with('error', 'Your verification is already under review.');
        }

        $frontPath = $request->file('document_front')->store("kyc/{$user->id}", 'public');
        $backPath = $request->file('document_back')?->store("kyc/{$user->id}", 'public');
        $selfiePath = $request->file('selfie')?->store("kyc/{$user->id}", 'public');

        Kyc::create([
            'user_id' => $user->id,
            'document_type' => $request->validated('document_type'),
            'document_front_path' => $frontPath,
            'document_back_path' => $backPath,
            'selfie_path' => $selfiePath,
            'status' => 'pending',
        ]);

        return redirect()->route('kyc.index')->with('success', 'Verification documents submitted for review.');
    }
}