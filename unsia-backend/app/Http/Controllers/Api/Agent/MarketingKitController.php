<?php
namespace App\Http\Controllers\Api\Agent;
use App\Http\Controllers\Controller;
use App\Models\MarketingKit;

class MarketingKitController extends Controller {
    public function index() {
        return response()->json(MarketingKit::all());
    }
}