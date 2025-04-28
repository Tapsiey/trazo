<?php

namespace App\Http\Controllers;

use App\Jobs\SendDocumentNotifications;
use App\Models\User;
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


        // $admins = User::role('admin')->get();

        $document->document_url = asset('storage/' . $document->file_path);

        Comment::create([
            'document_id' => $document->id,
            'user_id' => auth()->id(),
            'action' => 'Request Submitted',
            'message' => 'Document uploaded successfully by ' . auth()->user()->name,
        ]);

        SendDocumentNotifications::dispatch($document);
        // foreach ($admins as $admin) {
        //     $admin->notify(new DocumentSubmittedNotification($document));
        // }

        // $request->user()->notify(new DocumentReceivedNotification($document));

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
        $document = Document::with('uploader')->findOrFail($id);
        // $document->document_url = asset('storage/' . $document->file_path);

        $filePath = storage_path('app/public/' . $document->file_path);
        if (!file_exists($filePath)) {
            Log::error('File not found issue');
            return response()->json(['error' => 'File not found'], 404);
        }

        $parser = new Parser();
        $pdf = $parser->parseFile($filePath);
        $text = $pdf->getText();

        $endpoint = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

        $response = Http::withToken(env('HF_TOKEN'))
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

        $tag = $response['labels'][0] ?? 'unknown';

        Comment::create([
            'document_id' => $document->id,
            'user_id' => 1,
            'action' => 'trazo-bot-pipeline',
            'message' => "The document was automatically tagged into the $tag category.",
            'color' => 'blue'
        ]);

        $document->update([
            'category' => $tag,
            'status' => 'categorised',
        ]);


        Comment::create([
            'document_id' => $document->id,
            'user_id' => 1,
            'action' => 'trazo-bot-pipeline',
            'message' => "The document status has advanced from submitted to processed and is now under human review.",
            "color" => "green"
        ]);


        $summaryResponse = Http::withToken('HF_TOKEN')
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->post('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', [
                'inputs' => $text,
                'parameters' => [
                    'max_length' => 150,
                    'min_length' => 50,
                    'do_sample' => false,
                ],
            ]);

        $summaryResult = $summaryResponse->json();

        // Check if the response contains the expected structure
        $summary = isset($summaryResult[0]['summary_text']) ? $summaryResult[0]['summary_text'] : 'No summary available, failed to generate summary';

        Comment::create([
            'document_id' => $document->id,
            'user_id' => 1,
            'action' => 'trazo-bot-pipeline',
            'message' => $summary,
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


}