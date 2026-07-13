<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKycRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', 'in:passport,national_id,drivers_license'],
            'document_front' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'document_back' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'selfie' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }
}