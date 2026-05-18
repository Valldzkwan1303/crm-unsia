<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AgentProfile;
use App\Models\Wallet;
use App\Models\Payout;
use App\Models\Lead;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AgentController extends Controller
{
    // List data (Bisa filter semua, sgs, atau egs)
    public function index(Request $request)
    {
        $type = $request->query('type');
        $query = User::where('role', 'agent')->with(['agentProfile', 'wallet']);

        if ($type) {
            $query->whereHas('agentProfile', function ($q) use ($type) {
                $q->where('type', $type);
            });
        }

        $agents = $query->latest()->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->agentProfile->phone ?? '-',
                'area' => $user->agentProfile->area ?? '-',
                'status' => $user->is_active ? 'Aktif' : 'Pending',
                'type' => $user->agentProfile->type ?? 'umum',
                'nim' => $user->agentProfile->nim ?? '-',
                'referrals' => Lead::where('agent_id', $user->id)->count(),
                'commission' => $user->wallet->balance ?? 0,
                'referralCode' => $user->agentProfile->referral_code ?? '-',
                'bankInfo' => ($user->agentProfile->bank_name ?? '-') . ' - ' . ($user->agentProfile->account_number ?? '-'),
                'pending_payouts_count' => Payout::where('user_id', $user->id)->where('status', 'Menunggu')->count()
            ];
        });

        return response()->json($agents);
    }

    // Tambah data (Handle Umum, SGS, EGS)
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'area'  => 'required|string|max:255',
            'type'  => 'nullable|in:umum,sgs,egs',
            'nim'   => 'required_if:type,sgs|nullable|string|max:50',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $user = User::create([
                    'name'      => $request->name,
                    'email'     => $request->email,
                    'password'  => Hash::make('password123'),
                    'role'      => 'agent',
                    'is_active' => true,
                ]);

                // Generate referral code yang unik
                $prefix  = strtoupper(substr(str_replace([' ', '-'], '', $request->name), 0, 3));
                $refCode = 'REF-' . $prefix . '-' . strtoupper(\Illuminate\Support\Str::random(5));

                AgentProfile::create([
                    'user_id'      => $user->id,
                    'type'         => $request->type ?? 'umum',
                    'nim'          => $request->nim,
                    'phone'        => $request->phone,
                    'area'         => $request->area,
                    'referral_code' => $refCode,
                ]);

                Wallet::create([
                    'user_id'         => $user->id,
                    'balance'         => 0,
                    'pending_balance' => 0,
                ]);
            });

            return response()->json(['message' => 'Data berhasil disimpan']);
        } catch (\Exception $e) {
            \Log::error('AgentController@store error: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menyimpan data: ' . $e->getMessage()], 500);
        }
    }

    // Hapus data (CLEAN DELETE - ANTI ERROR 500)
    public function destroy($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $user = User::findOrFail($id);

                // 1. Putus hubungan dengan Leads (Mahasiswa gak boleh ikut kehapus)
                Lead::where('agent_id', $id)->update(['agent_id' => null]);

                // 2. Hapus data di tabel-tabel pendukung
                AgentProfile::where('user_id', $id)->delete();
                Wallet::where('user_id', $id)->delete();
                Payout::where('user_id', $id)->delete();

                // 3. Hapus User Utama
                $user->delete();
            });

            return response()->json(['message' => 'Data berhasil dihapus sepenuhnya']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Database Error: ' . $e->getMessage()], 500);
        }
    }

    // Fungsi tambahan (getAgentPayouts, approvePayout, updateStatus) tetap di sini...
    public function getAgentPayouts($id)
    {
        return response()->json(Payout::where('user_id', $id)->get());
    }
    public function updateStatus($id)
    {
        User::where('id', $id)->update(['is_active' => true]);
        return response()->json(['message' => 'Aktif']);
    }
    public function approvePayout(Request $request, $id)
    {
        Payout::where('id', $id)->update(['status' => 'Selesai']);
        return response()->json(['message' => 'Lunas']);
    }
}
