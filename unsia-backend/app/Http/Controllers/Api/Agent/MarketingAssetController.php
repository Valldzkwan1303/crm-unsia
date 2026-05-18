<?php

namespace App\Http\Controllers\Api\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MarketingAssetController extends Controller
{
    public function index()
    {
        $assets = \App\Models\MarketingAsset::orderBy('created_at', 'desc')->get();
        return response()->json($assets);
    }
}
