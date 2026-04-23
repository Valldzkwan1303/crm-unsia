<?php

use Illuminate\Support\Facades\Route;

// Import Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\BotController;
use App\Http\Controllers\Api\StudentPortalController; // Tambahkan ini
use App\Http\Controllers\Api\Public\PublicLeadController;

// Admin Controllers
use App\Http\Controllers\Api\Admin\LeadController;
use App\Http\Controllers\Api\Admin\AgentController;
use App\Http\Controllers\Api\Admin\ChannelController;
use App\Http\Controllers\Api\Admin\ReferenceController;
use App\Http\Controllers\Api\Admin\CampaignController;
use App\Http\Controllers\Api\Admin\SgsController;
use App\Http\Controllers\Api\Admin\EgsController;

// Agent Controllers
use App\Http\Controllers\Api\Agent\DashboardController as AgentDashboard;
use App\Http\Controllers\Api\Agent\FinanceController as AgentFinance;
use App\Http\Controllers\Api\Agent\MarketingKitController;
use App\Http\Controllers\Api\Agent\AgentProfileController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-agent', [AuthController::class, 'registerAgent']);
Route::get('/bot/options', [BotController::class, 'getOptions']);
Route::get('/public/institutions', [PublicLeadController::class, 'getInstitutions']);

// Grouping Public Lead agar rapi
Route::prefix('public/leads')->group(function () {
    Route::post('/', [PublicLeadController::class, 'store']);
    Route::get('/check-status/{code}', [PublicLeadController::class, 'checkStatus']);
    Route::post('/{id}/upload-registration', [PublicLeadController::class, 'uploadRegistrationFee']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Global Features
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/notifications/counts', [NotificationController::class, 'getCounts']);

    Route::prefix('profile')->group(function () {
        Route::post('/update', [ProfileController::class, 'updateProfile']);
        Route::post('/password', [ProfileController::class, 'updatePassword']);
        Route::post('/avatar', [ProfileController::class, 'updateAvatar']);
    });

    // Student Portal (Maba Portal)
    Route::prefix('student')->group(function () {
        Route::get('/status', [StudentPortalController::class, 'getStatus']);
        Route::post('/submit-test', [StudentPortalController::class, 'submitTest']);
        Route::post('/upload-payment', [StudentPortalController::class, 'uploadPayment']);
    });

    // --- ADMIN ROUTES ---
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // CRM Leads (Urutan: Custom routes HARUS di atas apiResource)
        Route::post('/leads/bulk-update', [LeadController::class, 'bulkUpdate']);
        Route::get('/leads/export', [LeadController::class, 'export']);
        Route::put('/leads/{id}/activate', [LeadController::class, 'activateAccount']); // Gerbang 1
        Route::put('/leads/{id}/sahkan', [LeadController::class, 'sahkanMahasiswa']);   // Gerbang 2
        Route::apiResource('/leads', LeadController::class);

        // Agents Management
        Route::put('/agents/{id}/approve', [AgentController::class, 'updateStatus']);
        Route::get('/agents/{id}/payouts', [AgentController::class, 'getAgentPayouts']);
        Route::put('/payouts/{id}/approve', [AgentController::class, 'approvePayout']);
        Route::apiResource('/agents', AgentController::class);

        // SGS Management
        Route::prefix('sgs')->group(function () {
            Route::get('/', [SgsController::class, 'index']);
            Route::post('/', [SgsController::class, 'store']);
            Route::put('/{id}', [SgsController::class, 'update']);
            Route::delete('/{id}', [SgsController::class, 'destroy']);
        });

        // EGS Management
        Route::prefix('egs')->group(function () {
            Route::get('/', [EgsController::class, 'index']);
            Route::post('/', [EgsController::class, 'store']);
            Route::put('/{id}', [EgsController::class, 'update']);
            Route::delete('/{id}', [EgsController::class, 'destroy']);
        });

        // System Configuration
        Route::apiResource('/channels', ChannelController::class);
        Route::apiResource('/campaigns', CampaignController::class);
        Route::apiResource('/references', ReferenceController::class);
    });

    // --- AGENT ROUTES ---
    Route::prefix('agent')->group(function () {
        Route::get('/dashboard', [AgentDashboard::class, 'index']);
        Route::get('/finance', [AgentFinance::class, 'index']);
        Route::post('/bank', [AgentFinance::class, 'updateBank']);
        Route::post('/withdraw', [AgentFinance::class, 'withdraw']);
        Route::get('/marketing-kits', [MarketingKitController::class, 'index']);
        Route::post('/update-referral', [AgentProfileController::class, 'updateReferralCode']);
        Route::get('/public/agent/{code}', [PublicLeadController::class, 'getAgentInfo']);
    });
});