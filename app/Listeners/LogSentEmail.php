<?php

namespace App\Listeners;

use App\Models\EmailLog;
use Illuminate\Mail\Events\MessageSent;

class LogSentEmail
{
    public function handle(MessageSent $event): void
    {
        $to = array_key_first($event->message->getTo() ?? []) ?? 'unknown';

        EmailLog::create([
            'to_email' => $to,
            'subject' => $event->message->getSubject() ?? '(no subject)',
            'body' => $event->message->getHtmlBody() ?? $event->message->getTextBody() ?? '',
        ]);
    }
}