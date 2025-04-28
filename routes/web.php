<?php

use App\Http\Controllers\DashboardController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/chat', function () {
        return Inertia::render('chat');
    })->name('chat');

    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments');

    Route::get('/documents', [DocumentController::class, 'index'])->name('documents');
    Route::post('/documents/{id}/run-pipeline', [DocumentController::class, 'runPipeline'])
        ->name('documents.runPipeline');
    Route::get('/documents/{id}', [DocumentController::class, 'show'])->name('track.document');
    Route::post('/documents/upload', [DocumentController::class, 'upload'])->name('upload');
    Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';