<?php

namespace App\Jobs;

use App\Models\Document;
use App\Notifications\DocumentRequestCompleted;
use App\Notifications\DocumentSubmissionCompleted;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;


class ProcessDocumentSubmission implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Document $document;

    public function __construct(Document $document)
    {
        $this->document = $document;
    }

    public function handle(): void
    {
        try {
            $admins = User::role('admin')->get();

            foreach ($admins as $admin) {
                $admin->notify(new DocumentRequestCompleted($this->document));
            }

            $this->document->uploader->notify(new DocumentSubmissionCompleted($this->document));

        } catch (Exception $e) {
            Log::error($e->getMessage());
        }
    }
}