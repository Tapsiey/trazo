<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['roles', 'permissions', 'department'])->get();
        return Inertia::render('users', ['users' => $users]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return to_route('users');
    }
}
