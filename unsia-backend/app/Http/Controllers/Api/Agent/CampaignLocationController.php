<?php

namespace App\Http\Controllers\Api\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CampaignLocationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $locations = DB::table('campaign_locations')
            ->where('user_id', $user->id)
            ->latest()
            ->get();
        return response()->json($locations);
    }

    public function store(Request $request)
    {
        $request->validate(['location_name' => 'required|string|max:100']);
        $user = auth()->user();

        $slug = Str::slug($request->location_name) . '-' . Str::random(5);

        $id = DB::table('campaign_locations')->insertGetId([
            'user_id' => $user->id,
            'type' => $user->role,
            'location_name' => $request->location_name,
            'location_slug' => $slug,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Lokasi tersimpan ke History!', 'slug' => $slug]);
    }

    public function getHistoryForAdmin($userId)
    {
        $locations = DB::table('campaign_locations')
            ->where('user_id', $userId)
            ->latest()
            ->get();
        return response()->json($locations);
    }
}