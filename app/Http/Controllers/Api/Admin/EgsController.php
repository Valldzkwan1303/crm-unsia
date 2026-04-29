<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EgsProfile;
use App\Models\Lead;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EgsController extends Controller
{
    public function index()
    {
        $staff = User::where('role', 'egs')
            ->with('egsProfile')
            ->get()
            ->map(function ($user) {
                $rekrutanCount = Lead::where('agent_id', $user->id)
                    ->where('status', 'active')
                    ->count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'nip' => $user->egsProfile->nip ?? '-',
                    'unit' => $user->egsProfile->department ?? '-',
                    'rekrutan' => $rekrutanCount,
                    'bonus' => $user->egsProfile->balance ?? 0,
                    'status' => $user->is_active ? 'Aktif' : 'Nonaktif'
                ];
            });

        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'nip' => 'required|unique:egs_profiles,nip',
            'department' => 'required'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->nip),
                    'role' => 'egs',
                    'is_active' => true
                ]);

                EgsProfile::create([
                    'user_id' => $user->id,
                    'nip' => $request->nip,
                    'department' => $request->department,
                    'balance' => 0
                ]);

                return response()->json(['message' => 'Ambassador EGS Berhasil Ditambahkan']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $profile = EgsProfile::where('user_id', $id)->first();
            if (!$profile) {
                $profile = new EgsProfile();
                $profile->user_id = $id;
            }

            $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'nip' => 'required|unique:egs_profiles,nip,' . ($profile->id ?? 0),
                'department' => 'required'
            ]);

            return DB::transaction(function () use ($request, $user, $profile) {
                $user->update([
                    'name' => $request->name,
                    'email' => $request->email,
                ]);

                $profile->nip = $request->nip;
                $profile->department = $request->department;
                $profile->save();

                return response()->json(['message' => 'Data Mahiru Berhasil Diupdate!']);
            });
        } catch (\Exception $e) {
            // Ini penting! Biar kamu tau error aslinya apa di tab Response browser
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $user = User::where('id', $id)->where('role', 'egs')->first();

                if (!$user) {
                    return response()->json(['message' => 'Data staf tidak ditemukan'], 404);
                }

                Lead::where('agent_id', $id)->update(['agent_id' => null]);

                DB::table('egs_profiles')->where('user_id', $id)->delete();
                DB::table('wallets')->where('user_id', $id)->delete();

                $user->delete();

                return response()->json(['message' => 'Staf berhasil dihapus. Data mahasiswa yang diajak telah dialihkan ke pendaftaran umum.']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus: ' . $e->getMessage()], 500);
        }
    }
}