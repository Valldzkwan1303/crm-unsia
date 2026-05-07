<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lead;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class B2bController extends Controller
{
    public function index()
    {
        $staff = User::where('role', 'b2b')->get()->map(function ($user) {
            $profile = DB::table('b2b_profiles')->where('user_id', $user->id)->first();
            
            $rekrutanCount = Lead::where('agent_id', $user->id)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'b2b_id' => $profile->b2b_id ?? '-',
                'department' => $profile->department ?? '-',
                'rekrutan' => $rekrutanCount,
            ];
        });
        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'b2b_id' => 'required|unique:b2b_profiles,b2b_id',
            'department' => 'required'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->b2b_id),
                    'role' => 'b2b',
                    'is_active' => true
                ]);

                DB::table('b2b_profiles')->insert([
                    'user_id' => $user->id,
                    'b2b_id' => $request->b2b_id,
                    'department' => $request->department,
                    'balance' => 0,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                return response()->json(['message' => 'PIC Kerjasama B2B Berhasil Ditambahkan']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'name' => $request->name,
            'email' => $request->email
        ]);

        DB::table('b2b_profiles')->where('user_id', $id)->update([
            'b2b_id' => $request->b2b_id,
            'department' => $request->department,
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Data Kerjasama B2B Berhasil Diperbarui']);
    }

    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                Lead::where('agent_id', $id)->update(['agent_id' => null]);

                // Hapus profil dan akun
                DB::table('b2b_profiles')->where('user_id', $id)->delete();
                User::destroy($id);

                return response()->json(['message' => 'Data Kerjasama B2B dihapus']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus'], 500);
        }
    }
}