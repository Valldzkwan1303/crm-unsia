<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Channel;

class ChannelController extends Controller
{
    public function index()
    {
        $channels = Channel::orderBy('created_at', 'desc')->get();
        return response()->json($channels);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $channel = Channel::create([
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Kanal berhasil ditambahkan',
            'data' => $channel
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $channel = Channel::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $channel->update([
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Kanal berhasil diperbarui',
            'data' => $channel
        ]);
    }

    public function destroy($id)
    {
        $channel = Channel::findOrFail($id);
        $channel->delete();

        return response()->json(['message' => 'Kanal berhasil dihapus']);
    }
}