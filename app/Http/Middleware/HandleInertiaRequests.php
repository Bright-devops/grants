<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user?->load('latestKyc'),
                'roles' => $user ? $user->getRoleNames() : [],
                'permissions' => $user ? $user->getAllPermissions()->pluck('name') : [],
                'unread_notifications_count' => $user?->unreadNotifications()->count() ?? 0,
            ],

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],

            'settings' => [
                'company_name' => Setting::get('company_name', 'United Care Alliance (UCA)'),
                'logo_path' => Setting::get('logo_path'),
                'support_email' => Setting::get('support_email'),
                'facebook_url' => Setting::get('facebook_url'),
                'twitter_url' => Setting::get('twitter_url'),
                'instagram_url' => Setting::get('instagram_url'),
                'linkedin_url' => Setting::get('linkedin_url'),
            ],
        ];
    }
}
