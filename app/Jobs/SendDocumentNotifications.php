<?php

namespace App\Jobs;

use App\Models\Document;
use App\Notifications\DocumentReceivedNotification;
use App\Notifications\DocumentSubmittedNotification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendDocumentNotifications implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public Document $document;

    public function __construct(Document $document)
    {
        $this->document = $document;
    }

    public function handle(): void
    {
        $admins = User::role('admin')->get();

        foreach ($admins as $admin) {
            $admin->notify(new DocumentSubmittedNotification($this->document));
        }

        $this->document->uploader->notify(new DocumentReceivedNotification($this->document));
    }
}