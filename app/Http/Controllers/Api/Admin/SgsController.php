<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lead;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SgsController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'sgs')
            ->get()
            ->map(function ($user) {
                $profile = DB::table('sgs_profiles')->where('user_id', $user->id)->first();
                $rekrutanCount = Lead::where('agent_id', $user->id)->where('status', 'active')->count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'nim' => $profile->nim ?? '-',
                    'prodi' => $profile->major ?? '-',
                    'rekrutan' => $rekrutanCount,
                    'tabungan' => $profile->scholarship_balance ?? 0,
                    'status' => $user->is_active ? 'Aktif' : 'Nonaktif'
                ];
            });

        return response()->json($students);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'nim' => 'required|unique:sgs_profiles,nim|min:8|max:14',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->nim),
                    'role' => 'sgs',
                    'is_active' => true
                ]);

                DB::table('sgs_profiles')->insert([
                    'user_id' => $user->id,
                    'nim' => $request->nim,
                    'major' => $request->major ?? 'Informatika',
                    'scholarship_balance' => 0,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                return response()->json(['message' => 'Ambassador SGS Berhasil Ditambahkan']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only('name', 'email'));
        DB::table('sgs_profiles')->where('user_id', $id)->update([
            'nim' => $request->nim,
            'major' => $request->major
        ]);

        return response()->json(['message' => 'Data SGS Diperbarui']);
    }

    public function destroy($id)
    {
        Lead::where('agent_id', $id)->update(['agent_id' => null]);
        DB::table('sgs_profiles')->where('user_id', $id)->delete();
        User::destroy($id);
        return response()->json(['message' => 'SGS Dihapus']);
    }
}