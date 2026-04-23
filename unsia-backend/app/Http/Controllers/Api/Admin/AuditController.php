<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;

class AuditController extends Controller {
    public function index() {
        return response()->json(AuditLog::with('user')->latest()->paginate(20));
    }
}