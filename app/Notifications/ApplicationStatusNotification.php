<?php

namespace App\Notifications;

use App\Models\GrantApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplicationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public GrantApplication $application) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = (new MailMessage)->greeting("Hi {$notifiable->name},");

        return match ($this->application->status) {
            'approved' => $mail
                ->subject('Your grant application has been approved')
                ->line("Your application for \${$this->application->requested_amount} has been approved.")
                ->line('Funds will be disbursed to your wallet shortly.'),
            'disbursed' => $mail
                ->subject('Your grant has been disbursed')
                ->line("\${$this->application->requested_amount} has been credited to your wallet.")
                ->action('View Wallet', route('wallet.index')),
            'rejected' => $mail
                ->subject('Update on your grant application')
                ->line('Your application was not approved.')
                ->line("Reason: {$this->application->admin_notes}"),
            default => $mail->subject('Application update')->line('Your application status has changed.'),
        };
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Application ' . ucfirst($this->application->status),
            'body' => "Your application {$this->application->reference} is now {$this->application->status}.",
        ];
    }
}
