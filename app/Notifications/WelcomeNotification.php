<?php

namespace App\Notifications;

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
        return (new MailMessage)
            ->subject('Welcome to GrantPortal')
            ->greeting("Welcome, {$notifiable->name}!")
            ->line('Your account has been created successfully.')
            ->line('To apply for a grant, you\'ll need to verify your identity first.')
            ->action('Complete Verification', route('kyc.index'))
            ->line('Thanks for joining GrantPortal.');
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Welcome to GrantPortal',
            'body' => 'Your account has been created. Verify your identity to get started.',
        ];
    }
}
