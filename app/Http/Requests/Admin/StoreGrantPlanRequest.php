<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGrantPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'application_fee' => ['required', 'numeric', 'min:0'],
            'minimum_amount' => ['required', 'numeric', 'min:0'],
            'maximum_amount' => ['required', 'numeric', 'gte:minimum_amount'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'maximum_amount.gte' => 'The maximum amount must be greater than or equal to the minimum amount.',
        ];
    }
}
