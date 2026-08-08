<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmailLogController;
use App\Http\Controllers\Admin\GrantPlanController as AdminGrantPlanController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WalletController as AdminWalletController;
use App\Http\Controllers\Admin\WithdrawalController as AdminWithdrawalController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\GrantPlanController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\TestimonialController as PublicTestimonialController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WithdrawalController;
use App\Http\Controllers\WithdrawalFeeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KycController;
use App\Http\Controllers\Admin\KycController as AdminKycController;
use App\Http\Controllers\KycDocumentController;
use App\Http\Controllers\PaymentProofController;
use App\Http\Controllers\InvoiceController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/grant-plans-public', [PageController::class, 'grantPlans'])->name('public.grant-plans');
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1')->name('contact.store');
Route::get('/testimonials', [PublicTestimonialController::class, 'index'])->name('public.testimonials.index');

/*
|--------------------------------------------------------------------------
| Authenticated user routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/grant-plans', [GrantPlanController::class, 'index'])->name('grant-plans.index');

    Route::get('/grant-plans/{grantPlan}/apply', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/grant-plans/{grantPlan}/apply', [ApplicationController::class, 'store'])->name('applications.store');
    Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');

    Route::get('/applications/{application}/pay', [PaymentController::class, 'create'])->name('applications.pay');
    Route::post('/applications/{application}/pay', [PaymentController::class, 'store'])->middleware('throttle:10,1')->name('applications.pay.store');

    Route::get('/wallet', [WalletController::class, 'index'])->name('wallet.index');

    // Withdrawals — index/create/store via WithdrawalController
    Route::get('/withdrawals', [WithdrawalController::class, 'index'])->name('withdrawals.index');
    Route::get('/withdrawals/create', [WithdrawalController::class, 'create'])->name('withdrawals.create');
    Route::post('/withdrawals', [WithdrawalController::class, 'store'])->middleware('throttle:10,1')->name('withdrawals.store');
    Route::get('/withdrawals/{withdrawal}/pay-fee', [WithdrawalFeeController::class, 'create'])->name('withdrawals.pay-fee');
    Route::post('/withdrawals/{withdrawal}/pay-fee', [WithdrawalFeeController::class, 'store'])->middleware('throttle:10,1')->name('withdrawals.pay-fee.store');

    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');

    // Notifications — full user-facing view via NotificationController
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{id}/mark-read', [NotificationController::class, 'markRead'])->name('notifications.mark-read');
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');

    Route::get('/settings', fn() => Inertia::render('Placeholder', ['title' => 'Settings']))->name('settings.index');
    Route::get('/kyc', [KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [KycController::class, 'store'])->middleware('throttle:10,1')->name('kyc.store');

    // Secure document streaming — owner or admin only (checked in the controller).
    // Never a raw public storage path: these are ID documents, payment proofs,
    // and financial PDFs.
    Route::get('/kyc/{kyc}/document/{type}', [KycDocumentController::class, 'show'])
        ->where('type', 'front|back|selfie')
        ->name('kyc.document');
    Route::get('/payments/{payment}/proof', [PaymentProofController::class, 'show'])
        ->name('payments.proof');
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Users — full management via UserController
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/suspend', [UserController::class, 'suspend'])->name('users.suspend');
    Route::patch('/users/{user}/activate', [UserController::class, 'activate'])->name('users.activate');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}/make-admin', [UserController::class, 'makeAdmin'])->name('users.make-admin');
    Route::patch('/users/{user}/remove-admin', [UserController::class, 'removeAdmin'])->name('users.remove-admin');

    // Grant Plans — full CRUD via GrantPlanController
    Route::get('/grant-plans', [AdminGrantPlanController::class, 'index'])->name('grant-plans.index');
    Route::post('/grant-plans', [AdminGrantPlanController::class, 'store'])->name('grant-plans.store');
    Route::put('/grant-plans/{grantPlan}', [AdminGrantPlanController::class, 'update'])->name('grant-plans.update');
    Route::delete('/grant-plans/{grantPlan}', [AdminGrantPlanController::class, 'destroy'])->name('grant-plans.destroy');
    Route::patch('/grant-plans/{grantPlan}/toggle-status', [AdminGrantPlanController::class, 'toggleStatus'])->name('grant-plans.toggle-status');

    // Applications — review/approve/reject/disburse/delete via ApplicationController
    Route::get('/applications', [AdminApplicationController::class, 'index'])->name('applications.index');
    Route::patch('/applications/{application}/approve', [AdminApplicationController::class, 'approve'])->name('applications.approve');
    Route::patch('/applications/{application}/reject', [AdminApplicationController::class, 'reject'])->name('applications.reject');
    Route::patch('/applications/{application}/disburse', [AdminApplicationController::class, 'disburse'])->name('applications.disburse');
    Route::delete('/applications/{application}', [AdminApplicationController::class, 'destroy'])->name('applications.destroy');

    // Wallet — index + fund via AdminWalletController
    Route::get('/wallet', [AdminWalletController::class, 'index'])->name('wallet.index');
    Route::post('/wallet/{wallet}/fund', [AdminWalletController::class, 'fund'])->name('wallet.fund');

    // Withdrawals — review/approve/mark-paid/reject via AdminWithdrawalController
    Route::get('/withdrawals', [AdminWithdrawalController::class, 'index'])->name('withdrawals.index');
    Route::patch('/withdrawals/{withdrawal}/approve', [AdminWithdrawalController::class, 'approve'])->name('withdrawals.approve');
    Route::patch('/withdrawals/{withdrawal}/mark-paid', [AdminWithdrawalController::class, 'markPaid'])->name('withdrawals.mark-paid');
    Route::patch('/withdrawals/{withdrawal}/reject', [AdminWithdrawalController::class, 'reject'])->name('withdrawals.reject');

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

    // Testimonials — full CRUD via TestimonialController
    Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
    Route::post('/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update'])->name('testimonials.update');
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('testimonials.destroy');
    Route::patch('/testimonials/{testimonial}/toggle-featured', [TestimonialController::class, 'toggleFeatured'])->name('testimonials.toggle-featured');

    Route::get('/pages', fn() => Inertia::render('Admin/Placeholder', ['title' => 'Pages']))->name('pages.index');

    // Notifications — admin broadcast/announcement via AnnouncementController
    Route::get('/notifications', [AnnouncementController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/send', [AnnouncementController::class, 'send'])->name('notifications.send');

    // Emails — sent email log via EmailLogController
    Route::get('/emails', [EmailLogController::class, 'index'])->name('emails.index');
    Route::get('/emails/{email}', [EmailLogController::class, 'show'])->name('emails.show');

    // Activity Logs — audit trail via ActivityLogController
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

    // Settings — full read/update via SettingController
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    Route::get('/kyc', [AdminKycController::class, 'index'])->name('kyc.index');
    Route::patch('/kyc/{kyc}/approve', [AdminKycController::class, 'approve'])->name('kyc.approve');
    Route::patch('/kyc/{kyc}/reject', [AdminKycController::class, 'reject'])->name('kyc.reject');
    Route::delete('/kyc/{kyc}', [AdminKycController::class, 'destroy'])->name('kyc.destroy');
});

require __DIR__ . '/auth.php';