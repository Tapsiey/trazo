<?php

namespace App\Jobs;

use App\Models\Document;
use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;

class ProcessDocumentCategory implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(protected int $documentId)
    {
        // You can also type‐hint & inject a Document here, but passing the ID
        // ensures you re-fetch to get the freshest data/state.
    }

    public function handle(): void
    {
        $document = Document::with('uploader')->find($this->documentId);

        if (!$document) {
            Log::error("ProcessDocumentCategory: Document {$this->documentId} not found");
            return;
        }

        $filePath = storage_path('app/public/' . $document->file_path);
        if (!file_exists($filePath)) {
            Log::error("ProcessDocumentCategory: file not found at {$filePath}");
            return;
        }

        // 1) extract text
        $parser = new Parser();
        $pdf = $parser->parseFile($filePath);
        $text = $pdf->getText();

        // 2) call HF classifier
        $endpoint = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
        $response = Http::withToken(env("HF_TOKEN"))
            ->post($endpoint, [
                'inputs' => $text,
                'parameters' => [
                    'candidate_labels' => [
                        'secondary school application form',
                        'primary school application form',
                        'curriculum guide',
                        'application form',
                        'request for funding',
                        'schools opening notice',
                        'letter',
                    ],
                ],
            ]);

        $tag = $response->json('labels.0', 'unknown');

        // 3) record a comment & update the document
        Comment::create([
            'document_id' => $document->id,
            'user_id' => 1,
            'action' => 'trazo-bot-pipeline',
            'message' => "The document was automatically auto-tagged into “{$tag}” category.",
            'color' => 'orange',
        ]);

        $document->update([
            'category' => $tag,
            'status' => 'categorised',
        ]);

        Comment::create([
            'document_id' => $document->id,
            'user_id' => 1,
            'action' => 'trazo-bot-pipeline',
            'message' => "Status advanced to “processed” and queued for human review.",
            'color' => 'orange',
        ]);
    }
}