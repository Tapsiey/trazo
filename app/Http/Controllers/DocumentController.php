<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;
use App\Notifications\DocumentReceivedNotification;
use App\Notifications\DocumentSubmittedNotification;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $documents = Document::with('uploader')->get();
        } else {
            $documents = Document::with('uploader')->where('uploaded_by', $user->id)
                ->orWhere('department_id', $user->department_id)
                ->get();
        }

        $documents->each(function ($document) {
            $document->document_url = URL::to($document->file_path);
        });

        return Inertia::render('documents', [
            'documents' => $documents
        ]);
    }

    public function upload(Request $request)
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

        $admins = User::role('admin')->get();

        $document->file_url = URL::to($document->file_path);

        foreach ($admins as $admin) {
            $admin->notify(new DocumentSubmittedNotification($document));
        }

        $request->user()->notify(new DocumentReceivedNotification($document));

        return to_route('documents');
    }
}
