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
        $user = auth()->user();
        $lead = Lead::where('email', $user->email)->first();

        $questions = $request->questions;
        $userAnswers = $request->answers;

        $correctCount = 0;
        $details = [];

        foreach ($questions as $index => $q) {
            $isCorrect = ($userAnswers[$index] == $q['correct']);
            if ($isCorrect)
                $correctCount++;

            $details[] = [
                'question' => $q['q'],
                'your_answer' => $q['a'][$userAnswers[$index] ?? 0],
                'correct_answer' => $q['a'][$q['correct']],
                'is_correct' => $isCorrect
            ];
        }

        $score = ($correctCount / count($questions)) * 100;
        $status = ($score >= 70) ? 'test_passed' : 'test_failed';

        $lead->update([
            'test_score' => $score,
            'test_results' => json_encode($details),
            'status' => $status
        ]);

        return response()->json(['message' => 'Ujian selesai', 'score' => $score, 'status' => $status]);
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

    public function uploadUkt(Request $request)
    {

        $request->validate([
            'ukt_proof' => 'required|file|mimes:jpg,png,jpeg,pdf|max:5120'
        ]);

        try {
            $user = auth()->user();

            $lead = Lead::where('email', $user->email)->first();

            if (!$lead) {
                return response()->json(['message' => 'Data pendaftaran tidak ditemukan'], 404);
            }

            if ($request->hasFile('ukt_proof')) {
                $path = $request->file('ukt_proof')->store('payments/ukt', 'public');

                $lead->update([
                    'payment_proof' => $path,
                    'status' => 'awaiting_payment',
                    'notes' => 'Mahasiswa telah mengunggah bukti bayar UKT.'
                ]);

                return response()->json([
                    'message' => 'Bukti pembayaran UKT berhasil diunggah!',
                    'path' => $path
                ], 200);
            }

            return response()->json(['message' => 'Gagal membaca file bukti bayar'], 400);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }
}