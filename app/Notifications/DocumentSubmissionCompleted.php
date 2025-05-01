<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;


class DocumentSubmissionCompleted extends Notification
{
    public function __construct(public $document)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $url = url('/documents/' . $this->document->id);
        $qr = QrCode::format('png')->size(200)->generate($url);

        $path = "qrcodes/{$this->document->id}.png";
        Storage::disk('public')->put($path, $qr);
        $qrUrl = Storage::disk('public')->url($path);

        return (new MailMessage)
            ->subject('New Document Submitted')
            ->markdown('emails.document-submission', [
                'document' => $this->document,
                'url' => $url,
                'qrCodeUrl' => $qrUrl,
            ]);
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'New document submitted: ' . $this->document->title,
            'link' => url('/documents/' . $this->document->id),
        ];
    }

}