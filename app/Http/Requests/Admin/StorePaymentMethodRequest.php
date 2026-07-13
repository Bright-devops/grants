<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:crypto,bank,zelle'],
            'name' => ['required', 'string', 'max:255'],
            'wallet_address' => ['nullable', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'account_name' => ['nullable', 'string', 'max:255'],
            'account_number' => ['nullable', 'string', 'max:255'],
            'routing_number' => ['nullable', 'string', 'max:255'],
            'zelle_email' => ['nullable', 'email', 'max:255'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}