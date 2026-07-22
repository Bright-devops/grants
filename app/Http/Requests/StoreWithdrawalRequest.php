<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWithdrawalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $wallet = $this->user()->wallet;

        return [
            'amount' => ['required', 'numeric', 'min:1', 'max:' . ($wallet->balance ?? 0)],
            'method' => ['required', 'in:crypto,bank,zelle'],
            'wallet_address' => ['required_if:method,crypto', 'nullable', 'string', 'max:255'],
            'bank_name' => ['required_if:method,bank', 'nullable', 'string', 'max:255'],
            'account_name' => ['required_if:method,bank', 'nullable', 'string', 'max:255'],
            'account_number' => ['required_if:method,bank', 'nullable', 'string', 'max:255'],
            'routing_number' => ['nullable', 'string', 'max:255'],
            'zelle_email' => ['required_if:method,zelle', 'nullable', 'email', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.max' => 'You cannot withdraw more than your wallet balance.',
        ];
    }
}