<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessDocumentCategory;
use App\Jobs\ProcessDocumentSubmission;
use App\Models\Comment;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Document;
use Illuminate\Http\Request;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    protected array $candidateLabels = [
        'Request for Funding',
        'Notice',
        'Official Letter',
        'Circular',
        'Report',
        'application form',
        'Policy Document',
        'Research Paper',
        'Assessment Report',
        'Newsletter',
    ];
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $documents = Document::with('uploader')->get();
        } else {
            $documents = Document::with('uploader')
                ->where('uploaded_by', $user->id)
                ->get();
        }

        $documents->each(function ($document) {
            $document->document_url = asset('storage/' . $document->file_path);
        });

        return Inertia::render('documents', [
            'documents' => $documents
        ]);
    }

    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|max:2048', // Max 2MB
            'category' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('uploads', $fileName, 'public');

        $document = Document::create([
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'category' => $request->category ?? 'Uncategorised',
            'uploaded_by' => auth()->id(),
            'department_id' => $request->department_id,
        ]);

        $document->document_url = asset('storage/' . $document->file_path);

        Comment::create([
            'document_id' => $document->id,
            'user_id' => auth()->id(),
            'action' => 'Request Submitted',
            'message' => 'Document uploaded successfully by ' . auth()->user()->name,
        ]);

        ProcessDocumentSubmission::dispatch($document);

        // $admins = User::role('admin')->get();
        // foreach ($admins as $admin) {
        //     $admin->notify(new DocumentRequestCompleted($document));
        // }

        // $request->user()->notify(new DocumentSubmissionCompleted($document));

        return to_route('documents');
    }

    public function show($id)
    {
        $document = Document::with(['uploader', 'comments.user'])->findOrFail($id);
        $document->document_url = asset('storage/' . $document->file_path);

        return Inertia::render('track-document', [
            'document' => $document,
        ]);
    }

    public function runPipeline($id)
    {
        $document = Document::with('uploader')->find($id);

        if (!$document) {
            Log::error("Document  not found");
            return;
        }

        $filePath = storage_path('app/public/' . $document->file_path);
        if (!file_exists($filePath)) {
            Log::error("file not found at {$filePath}");
            return;
        }

        // 1) extract text
        $parser = new Parser();
        $pdf = $parser->parseFile($filePath);
        $extractedText = $pdf->getText();

        $text = trim(preg_replace('/\s+/', ' ', $extractedText));
        $tag = $this->predictCategory($text);
        Log::info($tag);

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

        return to_route('documents');
    }

    public function destroy($id): RedirectResponse
    {
        // Ensure only users with roles other than 'user' can delete the document
        if (auth()->user()->hasRole('user')) {
            return redirect()->route('documents')->with('error', 'You do not have permission to delete this document.');
        }

        $document = Document::findOrFail($id);

        // Remove the associated file from storage
        Storage::disk('public')->delete($document->file_path);

        // Delete the document from the database
        $document->delete();


        return redirect()->route('documents')->with('success', 'Document deleted successfully.');
    }
    public function updateStatus(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|string|max:255',
        ]);

        $document = Document::findOrFail($id);
        $document->status = $request->status;
        $document->save();

        Comment::create([
            'document_id' => $document->id,
            'user_id' => auth()->id(),
            'action' => 'Status Updated',
            'message' => 'Document status updated to "' . $request->status . '" by ' . auth()->user()->name,
            'color' => 'green'
        ]);

        return redirect()->route('documents')->with('success', 'Document status updated.');
    }

    public function predictCategory(string $text): string
    {
        $endpoint = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
        $token = env('HF_TOKEN');

        $response = Http::withToken($token)
            ->post($endpoint, [
                'inputs' => $text,
                'parameters' => [
                    'candidate_labels' => $this->candidateLabels,
                ],
            ]);

        return $response->json('labels.0', 'unknown');
    }
}