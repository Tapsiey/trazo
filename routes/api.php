<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentController;


Route::get('/extract-text/{id}', [DocumentController::class, 'runPipeline']);
