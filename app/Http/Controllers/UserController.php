<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['roles', 'permissions', 'department'])->get();
        return Inertia::render('users', ['users' => $users]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|exists:roles,name',
            'department_id' => 'nullable|string|max:255',
        ]);

        $departmentId = (int) $validated['department_id'];

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'department_id' => $departmentId,
        ]);

        $user->assignRole($validated['role']);

        return back()->with('success', 'User created successfully.');
    }

    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    public function assignRoles(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions']);

        return redirect()->back()->with('success', 'New role set successfully.');
    }

}