<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function index(Request $request): Response
    {
        $wallet = $request->user()->wallet;

        return Inertia::render('Wallet/Index', [
            'wallet' => $wallet,
            'transactions' => $wallet
                ? $wallet->transactions()->latest()->get()
                : [],
        ]);
    }
}
