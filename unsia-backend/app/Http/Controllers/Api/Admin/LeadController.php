<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\User;
use App\Models\AgentProfile;
use App\Models\Wallet;
use App\Models\Payout;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Export;
use Illuminate\Support\Facades\Response;

class LeadController extends Controller
{
    public function index()
    {
        return response()->json(Lead::with('agent')->latest()->get());
    }

    public function sahkanMahasiswa(Request $request, $id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $lead = Lead::findOrFail($id);

                if ($lead->status === 'active') {
                    return response()->json(['message' => 'Sudah disahkan sebelumnya'], 400);
                }

                $lead->update(['status' => 'active']);

                // 2. LOGIKA KOMISI (Hanya jika ada pengajak)
                if ($lead->agent_id) {
                    $activeCount = Lead::where('agent_id', $lead->agent_id)->where('status', 'active')->count();
                    $amount = ($activeCount <= 25) ? 500000 : 700000;

                    $profile = AgentProfile::where('user_id', $lead->agent_id)->first();

                    if ($profile->type === 'sgs') {
                        DB::table('sgs_profiles')->where('user_id', $lead->agent_id)->increment('scholarship_balance', $amount);
                    } elseif ($profile->type === 'egs') {
                        DB::table('egs_profiles')->where('user_id', $lead->agent_id)->increment('balance', $amount);
                    } else {
                        $wallet = Wallet::firstOrCreate(['user_id' => $lead->agent_id], ['balance' => 0]);
                        $wallet->increment('balance', $amount);
                    }

                    // Catat riwayat
                    Payout::create([
                        'user_id' => $lead->agent_id,
                        'amount' => $amount,
                        'status' => 'Selesai',
                        'bank_details' => 'Sistem Otomatis',
                        'admin_note' => "Komisi Closing: {$lead->name}"
                    ]);
                }

                return response()->json(['message' => 'Mahasiswa SAH. Komisi partner telah dicairkan.']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $lead->update($request->all());
        return response()->json($lead);
    }

    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'status' => 'required|string']);
        foreach ($request->ids as $id) {
            if ($request->status === 'active') {
                $this->sahkanMahasiswa($request, $id);
            } else {
                Lead::where('id', $id)->update(['status' => $request->status]);
            }
        }
        return response()->json(['message' => 'Update massal sukses']);
    }

    public function activateStudent(Request $request, $id)
    {
        return DB::transaction(function () use ($id) {
            $lead = Lead::findOrFail($id);

            if ($lead->status !== 'lead') {
                return response()->json(['message' => 'Akun sudah diaktivasi sebelumnya'], 400);
            }

            $user = User::create([
                'name' => $lead->name,
                'email' => $lead->email,
                'password' => Hash::make('mabaunsia123'),
                'role' => 'student',
                'is_active' => true
            ]);

            // 2. Update status lead
            $lead->update(['status' => 'activated']);

            return response()->json(['message' => 'Akun berhasil diaktifkan! Mahasiswa kini bisa login.']);
        });
    }

    public function export()
    {
        $leads = Lead::with('agent')->get();
        $filename = "leads_report_" . date('Y-m-d') . ".csv";

        $handle = fopen('php://output', 'w');
        fputcsv($handle, ['Nama', 'Email', 'Status', 'Sumber', 'Referral Oleh']);

        foreach ($leads as $lead) {
            fputcsv($handle, [
                $lead->name,
                $lead->email,
                $lead->status,
                $lead->source_platform,
                $lead->agent->name ?? 'Umum'
            ]);
        }

        fclose($handle);

        return Response::make('', 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function activateAccount(Request $request, $id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $lead = Lead::findOrFail($id);

                if ($lead->status !== 'lead') {
                    return response()->json(['message' => 'Sudah aktif sebagai calon maba'], 400);
                }
                User::updateOrCreate(
                    ['email' => $lead->email],
                    [
                        'name' => $lead->name,
                        'password' => Hash::make('mabaunsia123'),
                        'role' => 'student',
                        'is_active' => true
                    ]
                );

                $lead->update(['status' => 'calon_mahasiswa']);

                return response()->json(['message' => 'Berhasil! Maba sekarang bisa login untuk Ujian.']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}