<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lead;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class BtsController extends Controller
{
    public function index()
    {
        $staff = User::where('role', 'bts')->get()->map(function ($user) {
            $profile = DB::table('bts_profiles')->where('user_id', $user->id)->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bts_id' => $profile->bts_id ?? '-',
                'unit' => $profile->unit ?? '-',
                'rekrutan' => Lead::where('agent_id', $user->id)->count(),
            ];
        });
        return response()->json($staff);
    }

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->bts_id),
                'role' => 'bts',
                'is_active' => true
            ]);
            DB::table('bts_profiles')->insert([
                'user_id' => $user->id,
                'bts_id' => $request->bts_id,
                'unit' => $request->unit,
                'created_at' => now(), 'updated_at' => now()
            ]);
            return response()->json(['message' => 'Petugas BTS Berhasil Ditambahkan']);
        });
    }

    public function destroy($id)
    {
        Lead::where('agent_id', $id)->update(['agent_id' => null]);
        DB::table('bts_profiles')->where('user_id', $id)->delete();
        User::destroy($id);
        return response()->json(['message' => 'Petugas dihapus']);
    }
}