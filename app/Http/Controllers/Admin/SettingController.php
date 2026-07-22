<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    protected array $keys = [
        // General
        'company_name',
        'support_email',
        'phone',
        'office_address',
        // Branding
        'logo_path',
        'seo_title',
        'seo_description',
        // Social
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'linkedin_url',
    ];

    public function index(): Response
    {
        $settings = Setting::whereIn('key', $this->keys)->pluck('value', 'key');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => collect($this->keys)->mapWithKeys(fn($key) => [$key => $settings[$key] ?? ''])->all(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => ['nullable', 'string', 'max:255'],
            'support_email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'office_address' => ['nullable', 'string', 'max:500'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg', 'max:1024'],
        ]);

        foreach ($validated as $key => $value) {
            if ($key === 'logo') {
                continue;
            }
            Setting::set($key, $value);
        }

        if ($request->hasFile('logo')) {
            $oldPath = Setting::get('logo_path');
            if ($oldPath) {
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('logo')->store('branding', 'public');
            Setting::set('logo_path', $path);
        }

        return back()->with('success', 'Settings updated.');
    }
}