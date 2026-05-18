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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::with(['agent.agentProfile', 'channel'])->latest()->get();
        return response()->json($leads);
    }

    public function activateAccount(Request $request, $id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $lead = Lead::findOrFail($id);

                if ($lead->status !== 'lead') {
                    return response()->json(['message' => 'Akun sudah diaktifkan sebelumnya'], 400);
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
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function sahkanMahasiswa(Request $request, $id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $lead = Lead::findOrFail($id);

                if ($lead->status === 'active') {
                    return response()->json(['message' => 'Sudah disahkan sebelumnya'], 400);
                }

                $this->prosesSahkan($lead, 'active');

                return response()->json(['message' => 'Mahasiswa SAH. Komisi partner telah dicairkan.']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    private function prosesSahkan($lead, $status)
    {
        if ($status === 'active' && $lead->status !== 'active') {
            if ($lead->agent_id) {
                $activeCount = Lead::where('agent_id', $lead->agent_id)->where('status', 'active')->count();
                $amount = ($activeCount < 25) ? 500000 : 700000;

                $user = User::find($lead->agent_id);

                if ($user) {
                    $type = $user->role;

                    if ($type === 'agent') {
                        $profile = AgentProfile::where('user_id', $user->id)->first();
                        $type = $profile ? $profile->type : 'umum';
                    }

                    if ($type === 'sgs') {
                        DB::table('sgs_profiles')->where('user_id', $user->id)->increment('scholarship_balance', $amount);
                    } elseif ($type === 'egs') {
                        DB::table('egs_profiles')->where('user_id', $user->id)->increment('balance', $amount);
                    } else {
                        $wallet = Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
                        $wallet->increment('balance', $amount);
                    }

                    Payout::create([
                        'user_id' => $user->id,
                        'amount' => $amount,
                        'status' => 'Selesai',
                        'bank_details' => 'Sistem Otomatis',
                        'admin_note' => "Komisi Closing: {$lead->name}"
                    ]);
                }
            }
        }
        $lead->status = $status;
        $lead->save();
    }


    /**
     * Tambah Prospek dari Dashboard Admin (ringan — hanya simpan ke tabel leads).
     * Tidak membuat User baru. Email bersifat opsional.
     */
    public function storeProspek(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'nullable|email|unique:leads,email',
            'phone'          => 'required|string|max:20',
            'prodi_interest' => 'required|string|max:255',
        ]);

        try {
            // Auto-generate kode registrasi unik: REG-YYYY-XXXXX
            do {
                $regCode = 'REG-' . date('Y') . '-' . strtoupper(Str::random(5));
            } while (Lead::where('registration_code', $regCode)->exists());

            $lead = Lead::create([
                'name'              => $request->name,
                'email'             => $request->email ?? null,
                'phone'             => $request->phone,
                'prodi_interest'    => $request->prodi_interest,
                'registration_code' => $regCode,
                'source_platform'   => 'Admin Panel',
                'status'            => 'New',
                'notes'             => 'Manual oleh Admin Dashboard',
            ]);

            return response()->json([
                'message' => 'Prospek berhasil ditambahkan.',
                'data'    => $lead,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email|unique:users,email',
            'phone' => 'required',
            'prodi_interest' => 'required',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $regCode = 'REG-' . strtoupper(Str::random(10));

                User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make('mabaunsia123'),
                    'role' => 'student',
                    'is_active' => true
                ]);

                $lead = Lead::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'prodi_interest' => $request->prodi_interest,
                    'channel_id' => $request->channel_id ?? 1,
                    'agent_id' => $request->agent_id,
                    'registration_code' => $regCode,
                    'source_platform' => 'Admin Panel',
                    'status' => 'lead',
                    'notes' => $request->notes ?? 'Manual by Admin'
                ]);

                return response()->json(['message' => 'Mahasiswa & Akun Berhasil Dibuat', 'data' => $lead], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'status' => 'required|string'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                if ($request->status === 'active') {
                    $leads = Lead::whereIn('id', $request->ids)->get();

                    foreach ($leads as $lead) {
                        /** @var Lead $lead */
                        $this->prosesSahkan($lead, 'active');
                    }
                } else {

                    Lead::whereIn('id', $request->ids)->update(['status' => $request->status]);
                }

                return response()->json([
                    'message' => 'Berhasil memperbarui ' . count($request->ids) . ' data massal.'
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal massal: ' . $e->getMessage()], 500);
        }
    }

    public function export()
    {
        $leads = Lead::with('agent')->get();
        $filename = "leads_report_" . date('Y-m-d') . ".csv";

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($leads) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Nama', 'Email', 'Status', 'Sumber', 'Referral Oleh']);
            foreach ($leads as $lead) {
                fputcsv($file, [$lead->name, $lead->email, $lead->status, $lead->source_platform, $lead->agent->name ?? 'Umum']);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $oldStatus = $lead->status;
        $newStatus = $request->status;

        try {
            return DB::transaction(function () use ($lead, $request, $oldStatus, $newStatus) {
                if ($newStatus === 'active' && $oldStatus !== 'active') {
                    $lead->fill($request->all());
                    $this->prosesSahkan($lead, 'active');
                } else {
                    $lead->update($request->all());
                }

                return response()->json($lead->load('agent.agentProfile'));
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal update: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();
        return response()->json(['message' => 'Data Dihapus']);
    }
}
