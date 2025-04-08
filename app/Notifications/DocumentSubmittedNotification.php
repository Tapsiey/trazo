<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class DocumentSubmittedNotification extends Notification
{
    public function __construct(public $document) {}

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Document Submitted')
            ->line('A new document titled "' . $this->document->title . '" has been submitted.')
            ->action('View Document', url('/admin/documents/' . $this->document->id));
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'New document submitted: ' . $this->document->title,
            'link' => url('/admin/documents/' . $this->document->id),
        ];
    }
}
