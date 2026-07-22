<?php

namespace App\Notifications;

use App\Models\Withdrawal;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class WithdrawalStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Withdrawal $withdrawal) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = (new MailMessage)->greeting("Hi {$notifiable->name},");

        return match ($this->withdrawal->status) {
            'processing' => $mail
                ->subject('Withdrawal approved')
                ->line("Your withdrawal request of \${$this->withdrawal->amount} has been approved and is being processed.")
                ->action('View Withdrawals', route('withdrawals.index')),
            'completed' => $mail
                ->subject('Withdrawal paid')
                ->line("Your withdrawal of \${$this->withdrawal->amount} has been paid.")
                ->line('An invoice is available in your account.')
                ->action('View Invoice', route('invoices.index')),
            'rejected' => $mail
                ->subject('Withdrawal rejected')
                ->line("Your withdrawal request of \${$this->withdrawal->amount} was rejected.")
                ->line('The funds have been returned to your wallet.')
                ->action('View Wallet', route('wallet.index')),
            default => $mail->subject('Withdrawal update')->line('Your withdrawal status has changed.'),
        };
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Withdrawal ' . ucfirst($this->withdrawal->status),
            'body' => "Your withdrawal of \${$this->withdrawal->amount} is now {$this->withdrawal->status}.",
        ];
    }
}
