<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/PaymentMethods/Index', [
            'methods' => PaymentMethod::latest()->get(),
        ]);
    }

    public function store(StorePaymentMethodRequest $request): RedirectResponse
    {
        PaymentMethod::create($request->validated());

        return back()->with('success', 'Payment method added.');
    }

    public function update(StorePaymentMethodRequest $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        $paymentMethod->update($request->validated());

        return back()->with('success', 'Payment method updated.');
    }

    public function destroy(PaymentMethod $paymentMethod): RedirectResponse
    {
        // payments.payment_method_id is a required FK, so this method can't
        // just be hard-deleted while payments still point at it (that's the
        // "Cannot delete or update a parent row" error). Instead: move any
        // existing payments over to another active method, then soft-delete
        // this one so it drops off the active list but the row (and the FK
        // it satisfies) stays intact for history/reporting.
        $replacement = PaymentMethod::active()
            ->where('id', '!=', $paymentMethod->id)
            ->orderBy('id')
            ->first();

        $paymentsCount = $paymentMethod->payments()->count();

        if ($paymentsCount > 0 && !$replacement) {
            return back()->with('error', 'This is the only active payment method and it has existing payments attached — activate another payment method first, then delete this one.');
        }

        DB::transaction(function () use ($paymentMethod, $replacement, $paymentsCount) {
            if ($paymentsCount > 0) {
                $paymentMethod->payments()->update(['payment_method_id' => $replacement->id]);
            }

            $paymentMethod->delete();
        });

        $message = $paymentsCount > 0
            ? "Payment method deleted. {$paymentsCount} existing payment(s) were moved to \"{$replacement->name}\"."
            : 'Payment method deleted.';

        return back()->with('success', $message);
    }

    public function toggleStatus(PaymentMethod $paymentMethod): RedirectResponse
    {
        $paymentMethod->update([
            'status' => $paymentMethod->status === 'active' ? 'inactive' : 'active',
        ]);

        return back()->with('success', 'Status updated.');
    }
}