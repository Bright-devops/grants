<?php

use App\Http\Controllers\Admin\GrantPlanController as AdminGrantPlanController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\WalletController as AdminWalletController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\GrantPlanController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WalletController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KycController;
use App\Http\Controllers\Admin\KycController as AdminKycController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Authenticated user routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/kyc', fn() => Inertia::render('Placeholder', ['title' => 'KYC']))->name('kyc.index');

    Route::get('/grant-plans', [GrantPlanController::class, 'index'])->name('grant-plans.index');

    Route::get('/grant-plans/{grantPlan}/apply', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/grant-plans/{grantPlan}/apply', [ApplicationController::class, 'store'])->name('applications.store');
    Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');

    Route::get('/applications/{application}/pay', [PaymentController::class, 'create'])->name('applications.pay');
    Route::post('/applications/{application}/pay', [PaymentController::class, 'store'])->name('applications.pay.store');

    Route::get('/wallet', [WalletController::class, 'index'])->name('wallet.index');
    Route::get('/withdrawals', fn() => Inertia::render('Placeholder', ['title' => 'Withdrawals']))->name('withdrawals.index');
    Route::get('/invoices', fn() => Inertia::render('Placeholder', ['title' => 'Invoices']))->name('invoices.index');
    Route::get('/notifications', fn() => Inertia::render('Placeholder', ['title' => 'Notifications']))->name('notifications.index');
    Route::get('/settings', fn() => Inertia::render('Placeholder', ['title' => 'Settings']))->name('settings.index');
    Route::get('/kyc', [KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [KycController::class, 'store'])->name('kyc.store');
});

/*
|--------------------------------------------------------------------------
| Profile routes (Breeze default — not yet restyled)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin routes — protected by role:admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Admin/Dashboard'))->name('dashboard');
    Route::get('/users', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Users']))->name('users.index');

    // Grant Plans — full CRUD via GrantPlanController
    Route::get('/grant-plans', [AdminGrantPlanController::class, 'index'])->name('grant-plans.index');
    Route::post('/grant-plans', [AdminGrantPlanController::class, 'store'])->name('grant-plans.store');
    Route::put('/grant-plans/{grantPlan}', [AdminGrantPlanController::class, 'update'])->name('grant-plans.update');
    Route::delete('/grant-plans/{grantPlan}', [AdminGrantPlanController::class, 'destroy'])->name('grant-plans.destroy');
    Route::patch('/grant-plans/{grantPlan}/toggle-status', [AdminGrantPlanController::class, 'toggleStatus'])->name('grant-plans.toggle-status');

    Route::get('/applications', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Applications']))->name('applications.index');
    Route::get('/kyc', fn() => Inertia::render('Admin/Placeholder', ['title' => 'KYC']))->name('kyc.index');

    // Wallet — index + fund via AdminWalletController
    Route::get('/wallet', [AdminWalletController::class, 'index'])->name('wallet.index');
    Route::post('/wallet/{wallet}/fund', [AdminWalletController::class, 'fund'])->name('wallet.fund');

    Route::get('/withdrawals', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Withdrawals']))->name('withdrawals.index');

    // Payment Methods — full CRUD via PaymentMethodController
    Route::get('/payment-methods', [PaymentMethodController::class, 'index'])->name('payment-methods.index');
    Route::post('/payment-methods', [PaymentMethodController::class, 'store'])->name('payment-methods.store');
    Route::put('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update'])->name('payment-methods.update');
    Route::delete('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy'])->name('payment-methods.destroy');
    Route::patch('/payment-methods/{paymentMethod}/toggle-status', [PaymentMethodController::class, 'toggleStatus'])->name('payment-methods.toggle-status');

    // Payments — review/confirm/reject via AdminPaymentController
    Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::patch('/payments/{payment}/confirm', [AdminPaymentController::class, 'confirm'])->name('payments.confirm');
    Route::patch('/payments/{payment}/reject', [AdminPaymentController::class, 'reject'])->name('payments.reject');

    Route::get('/testimonials', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Testimonials']))->name('testimonials.index');
    Route::get('/pages', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Pages']))->name('pages.index');
    Route::get('/notifications', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Notifications']))->name('notifications.index');
    Route::get('/emails', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Emails']))->name('emails.index');
    Route::get('/settings', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Settings']))->name('settings.index');

    Route::get('/kyc', [AdminKycController::class, 'index'])->name('kyc.index');
    Route::patch('/kyc/{kyc}/approve', [AdminKycController::class, 'approve'])->name('kyc.approve');
    Route::patch('/kyc/{kyc}/reject', [AdminKycController::class, 'reject'])->name('kyc.reject');
});

require __DIR__ . '/auth.php';