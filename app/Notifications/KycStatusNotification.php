<?php

namespace App\Notifications;

use App\Models\Kyc;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class KycStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Kyc $kyc) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = (new MailMessage)->greeting("Hi {$notifiable->name},");

        if ($this->kyc->status === 'approved') {
            return $mail
                ->subject('Your identity has been verified')
                ->line('Great news — your identity verification has been approved.')
                ->line('You can now apply for any grant plan.')
                ->action('Browse Grant Plans', route('grant-plans.index'));
        }

        return $mail
            ->subject('Your verification needs attention')
            ->line('Your identity verification was not approved.')
            ->line("Reason: {$this->kyc->rejection_reason}")
            ->action('Resubmit Documents', route('kyc.index'));
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => $this->kyc->status === 'approved' ? 'Identity Verified' : 'Verification Rejected',
            'body' => $this->kyc->status === 'approved'
                ? 'Your identity has been verified. You can now apply for grants.'
                : "Verification rejected: {$this->kyc->rejection_reason}",
        ];
    }
}
