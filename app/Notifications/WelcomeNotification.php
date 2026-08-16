<?php

namespace App\Notifications;

use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $brandName = Setting::get('company_name') ?: config('app.name');

        return (new MailMessage)
            ->theme('uca')
            ->subject("Welcome to {$brandName}")
            ->greeting("Welcome, {$notifiable->name}!")
            ->line('Your account has been created successfully.')
            ->line('To apply for a grant, you\'ll need to verify your identity first.')
            ->action('Complete Verification', route('kyc.index'))
            ->line("Thanks for joining {$brandName}.");
    }

    public function toArray($notifiable): array
    {
        $brandName = Setting::get('company_name') ?: config('app.name');

        return [
            'title' => "Welcome to {$brandName}",
            'body' => 'Your account has been created. Verify your identity to get started.',
        ];
    }
}