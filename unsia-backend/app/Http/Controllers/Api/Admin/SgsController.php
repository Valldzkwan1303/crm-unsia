<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SgsProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SgsController extends Controller
{
    public function index() {
        // Ambil user role sgs, sertakan profilnya, dan HITUNG jumlah lead yang dia bawa
        return response()->json(
            User::where('role', 'sgs')
                ->with('sgsProfile')
                ->withCount('leadsAsSgs') 
                ->get()
        );
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'nim' => 'required|unique:sgs_profiles',
            'major' => 'required'
        ]);

        return DB::transaction(function() use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->nim),
                'role' => 'sgs',
                'is_active' => true
            ]);

            SgsProfile::create([
                'user_id' => $user->id,
                'nim' => $request->nim,
                'major' => $request->major
            ]);

            return response()->json(['message' => 'Ambassador Berhasil Ditambahkan']);
        });
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$id,
            'nim' => 'required|unique:sgs_profiles,nim,'.$user->sgsProfile->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Jika password diisi, update passwordnya
        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        $user->sgsProfile->update([
            'nim' => $request->nim,
            'major' => $request->major
        ]);

        return response()->json(['message' => 'Data berhasil diperbarui']);
    }

    public function destroy($id)
{
    try {
        DB::transaction(function () use ($id) {
            DB::table('leads')->where('agent_id', $id)->update(['agent_id' => null]);

           DB::table('sgs_profiles')->where('user_id', $id)->delete();
            DB::table('agent_profiles')->where('user_id', $id)->delete();
            DB::table('wallets')->where('user_id', $id)->delete();

        
            DB::table('users')->where('id', $id)->delete();
        });

        return response()->json(['message' => 'Data SGS berhasil dihapus']);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Gagal hapus: ' . $e->getMessage()], 500);
    }
}
}