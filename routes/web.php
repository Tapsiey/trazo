<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments');

    Route::get('/documents', function () {
        return Inertia::render('documents');
    })->name('documents');


    Route::get('/users', [UserController::class, 'index'])->name('users');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
