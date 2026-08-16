<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class PaymentStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = (new MailMessage)->theme('uca')->greeting("Hi {$notifiable->name},");

        if ($this->payment->status === 'confirmed') {
            return $mail
                ->subject('Payment confirmed')
                ->line("Your payment of \${$this->payment->amount} has been confirmed.")
                ->line('Your grant application is now under review.')
                ->action('View Application', route('applications.index'));
        }

        return $mail
            ->subject('Payment could not be confirmed')
            ->line("Your payment of \${$this->payment->amount} could not be verified.")
            ->action('Try Again', route('applications.index'));
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => $this->payment->status === 'confirmed' ? 'Payment Confirmed' : 'Payment Rejected',
            'body' => "Your payment of \${$this->payment->amount} was {$this->payment->status}.",
        ];
    }
}