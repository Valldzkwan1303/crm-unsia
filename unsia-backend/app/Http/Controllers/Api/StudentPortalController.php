<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use Illuminate\Support\Facades\Auth;

class StudentPortalController extends Controller
{
    public function getStatus()
    {
        $user = Auth::user();
        $lead = Lead::where('email', $user->email)->first();
        return response()->json(['user' => $user, 'lead' => $lead]);
    }

    public function payTestFee(Request $request)
    {
        $request->validate(['payment_proof' => 'required|image|max:2048']);
        $lead = Lead::where('email', Auth::user()->email)->first();

        $path = $request->file('payment_proof')->store('payments/test', 'public');

        $lead->update([
            'payment_proof' => $path,
            'status' => 'calon_maba'
        ]);

        return response()->json(['message' => 'Bukti bayar ujian berhasil dikirim.']);
    }

    public function submitTest(Request $request)
    {
        $lead = Lead::where('email', Auth::user()->email)->first();

        $score = rand(30, 100);
        $newStatus = ($score >= 60) ? 'test_passed' : 'test_failed';

        $lead->update([
            'test_score' => $score,
            'status' => $newStatus,
            'admin_note' => "Skor Ujian: " . $score . " (" . ($newStatus == 'test_passed' ? 'Lulus' : 'Gagal') . ")"
        ]);

        return response()->json(['message' => 'Selesai', 'status' => $newStatus]);
    }

    public function uploadPayment(Request $request)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        try {
            $user = Auth::user();
            $lead = Lead::where('email', $user->email)->first();

            if (!$lead) {
                return response()->json(['message' => 'Data pendaftaran tidak ditemukan'], 404);
            }

            if ($request->hasFile('payment_proof')) {
                $path = $request->file('payment_proof')->store('payments/ukt', 'public');
                
                $lead->update([
                    'payment_proof' => $path,
                    'status' => 'awaiting_payment' 
                ]);

                return response()->json(['message' => 'Bukti pembayaran UKT berhasil diunggah!']);
            }

            return response()->json(['message' => 'File tidak terdeteksi'], 400);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }
}