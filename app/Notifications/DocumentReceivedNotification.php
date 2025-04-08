<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class DocumentReceivedNotification extends Notification
{
    public function __construct(public $document) {}

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('We Received Your Document')
            ->line('Your document "' . $this->document->title . '" has been received.')
            ->line('Our admins are now reviewing it.')
            ->action('Track Document', url('/documents/track/' . $this->document->id));
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Your document is being reviewed.',
            'link' => url('/documents/track/' . $this->document->id),
        ];
    }
}
