<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Campaign;

class CampaignController extends Controller
{
    public function index()
    {
        return response()->json(Campaign::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'subject' => 'required',
            'content' => 'required',
            'recipients_count' => 'numeric',
            'status' => 'required',
            'scheduled_at' => 'nullable|date'
        ]);

        Campaign::create($data);
        return response()->json(['message' => 'Kampanye dibuat']);
    }

    public function update(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->update($request->all());
        return response()->json(['message' => 'Kampanye diperbarui']);
    }

    public function destroy($id)
    {
        Campaign::findOrFail($id)->delete();
        return response()->json(['message' => 'Kampanye dihapus']);
    }
}