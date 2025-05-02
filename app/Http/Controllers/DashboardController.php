<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isRegularUser = $user->hasRole('user');

        $usage = [
            [
                'name' => 'Total Documents',
                'stat' => Document::count(),
            ],
            [
                'name' => 'Recent Documents',
                'stat' => Document::orderBy('created_at', 'desc')->take(5)->count(),
            ],
            [
                'name' => 'Total Users',
                'stat' => User::count(),
            ],
            [
                'name' => 'Departments',
                'stat' => Department::count(),
            ],
        ];

        $roles = Role::pluck('name')->toArray();

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
                'users' => [],
                "roles" => [],
                "departments" => []
            ]);

        }

        $users = User::with('roles', 'department')->get();
        return Inertia::render('dashboard', [
            'usage' => $usage,
            'users' => $users,
            'documents' => [],
            'roles' => $roles,
            'departments' => Department::all()
        ]);

    }
}