<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isRegularUser = $user->hasRole('user');

        $usage = [
            'total_documents' => Document::count(),
            'recent_documents' => Document::orderBy('created_at', 'desc')->take(5)->count(),
            'total_users' => User::count(),
            'department_documents' => Document::where('department_id', $user->department_id)->count(),
        ];

        if ($isRegularUser) {
            $documents = Document::with('uploader')
                ->where('uploaded_by', $user->id)
                ->orWhere('department_id', $user->department_id)
                ->get();

            $documents->each(function ($document) {
                $document->document_url = asset('storage/' . $document->file_path);
            });

            return Inertia::render('dashboard', [
                'usage' => [],
                'documents' => $documents,
                'users' => []
            ]);

        }

        $users = User::with('roles', 'department')->get();
        return Inertia::render('dashboard', [
            'usage' => $usage,
            'users' => $users,
            'documents' => []
        ]);

    }
}