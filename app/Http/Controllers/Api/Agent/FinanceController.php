<?php

namespace App\Http\Controllers\Api\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Payout;

class FinanceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $wallet = $user->wallet;
        $profile = $user->agentProfile;

        $history = Payout::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($payout) {
                return [
                    'id' => 'TRX-' . str_pad($payout->id, 5, '0', STR_PAD_LEFT),
                    'date' => $payout->created_at->format('d M Y'),
                    'amount' => $payout->amount,
                    'status' => $payout->status,
                    'desc' => $payout->admin_note ?? 'Penarikan Dana ke ' . $payout->bank_details
                ];
            });

        return response()->json([
            'balance' => $wallet->balance ?? 0,
            'bank_name' => $profile->bank_name ?? 'BCA',
            'account_number' => $profile->account_number ?? '',
            'history' => $history
        ]);
    }

    public function updateBank(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string',
            'account_number' => 'required|numeric',
        ]);

        $user = Auth::user();
        $user->agentProfile()->update([
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number
        ]);

        return response()->json(['message' => 'Rekening berhasil disimpan']);
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:50000',
        ]);

        $user = Auth::user();
        $amount = $request->amount;

        if ($user->wallet->balance < $amount) {
            return response()->json(['message' => 'Saldo tidak mencukupi'], 400);
        }

        if (!$user->agentProfile->account_number) {
            return response()->json(['message' => 'Silakan atur rekening terlebih dahulu'], 400);
        }

        try {
            DB::transaction(function () use ($user, $amount) {
                $user->wallet->decrement('balance', $amount);

                Payout::create([
                    'user_id' => $user->id,
                    'amount' => $amount,
                    'bank_details' => $user->agentProfile->bank_name . ' - ' . $user->agentProfile->account_number,
                    'status' => 'Menunggu'
                ]);
            });

            return response()->json(['message' => 'Permintaan penarikan berhasil diajukan']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses penarikan'], 500);
        }
    }
}