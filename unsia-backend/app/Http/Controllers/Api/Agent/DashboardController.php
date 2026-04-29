<?php

namespace App\Http\Controllers\Api\Agent;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\User;
use App\Models\Wallet;
use App\Models\AgentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    /**
     * TAMPILAN DASHBOARD UTAMA (GABUNGAN)
     * Mengambil data stats, referral, link, dan grafik
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $agentCode = 'N/A';
            $type = 'umum';

            $agentProf = AgentProfile::where('user_id', $user->id)->first();
            if ($agentProf) {
                $agentCode = $agentProf->referral_code;
                $type = $agentProf->type;
            } elseif ($sgsProf = DB::table('sgs_profiles')->where('user_id', $user->id)->first()) {
                $agentCode = $sgsProf->nim;
                $type = 'sgs';
            } elseif ($egsProf = DB::table('egs_profiles')->where('user_id', $user->id)->first()) {
                $agentCode = $egsProf->nip;
                $type = 'egs';
            }

            $activeCount = Lead::where('agent_id', $user->id)->where('status', 'active')->count();
            $currentTierAmount = ($activeCount < 25) ? 500000 : 700000;

            $referrals = Lead::where('agent_id', $user->id)
                ->latest()
                ->get()
                ->map(function ($lead) use ($currentTierAmount) {
                    return [
                        'id' => $lead->id,
                        'name' => $lead->name,
                        'prodi' => $lead->prodi_interest,
                        'status' => $lead->status,
                        'source' => strtoupper($lead->source_platform ?: 'Direct'),
                        'registration_fee_proof' => $lead->registration_fee_proof,
                        'phone' => $lead->phone,
                        'commission_potential' => $currentTierAmount
                    ];
                });

            $balance = 0;
            if ($type === 'sgs') {
                $balance = DB::table('sgs_profiles')->where('user_id', $user->id)->value('scholarship_balance');
            } elseif ($type === 'egs') {
                $balance = DB::table('egs_profiles')->where('user_id', $user->id)->value('balance');
            } else {
                $balance = Wallet::where('user_id', $user->id)->value('balance');
            }

            return response()->json([
                'stats' => [
                    'total_referrals' => $referrals->count(),
                    'commission_balance' => (float) ($balance ?? 0),
                    'agent_status' => $user->is_active ? 'Active' : 'Pending',
                    'agent_code' => $agentCode,
                    'agent_name' => $user->name,
                    'agent_type' => $type
                ],
                'referrals' => $referrals,
                'source_stats' => $this->calculateSourceStats($user->id),
                // JALUR PISAH: Agent Umum ke /p/, SGS/EGS ke /join
                'referral_link' => ($type === 'umum')
                    ? url('/p/' . $agentCode)
                    : url('/join?ref=' . $agentCode),
                'chart_data' => $this->calculateDailyTrends($user->id)
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Backend Error: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email|unique:users,email',
            'phone' => 'required|string',
            'prodi_interest' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $agentId = null;
            $channelId = 1;

            $ref = $request->input('ref');
            $source = $request->input('src') ?? $request->input('source') ?? 'direct';

            if ($ref) {
                $egs = DB::table('egs_profiles')->where('nip', $ref)->first();
                if ($egs) {
                    $agentId = $egs->user_id;
                    $channelId = 5;
                }
                if (!$agentId) {
                    $sgs = DB::table('sgs_profiles')->where('nim', $ref)->first();
                    if ($sgs) {
                        $agentId = $sgs->user_id;
                        $channelId = 4;
                    }
                }
                if (!$agentId) {
                    $partner = AgentProfile::where('referral_code', $ref)->first();
                    if ($partner) {
                        $agentId = $partner->user_id;
                        $channelId = 2;
                    }
                }
            }

            $regCode = 'REG-' . strtoupper(Str::random(10));

            $lead = Lead::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'prodi_interest' => $request->prodi_interest,
                'agent_id' => $agentId,
                'channel_id' => $channelId,
                'registration_code' => $regCode,
                'source_platform' => strtolower($source),
                'status' => 'lead',
                'notes' => $agentId ? "Pendaftaran via Partner ID: " . $agentId : "Pendaftaran Mandiri",
            ]);

            return response()->json(['status' => 'success', 'registration_code' => $regCode, 'data' => $lead], 201);
        });
    }

    private function calculateSourceStats($agentId)
    {
        $stats = Lead::where('agent_id', $agentId)
            ->select('source_platform', DB::raw('count(*) as total'))
            ->groupBy('source_platform')
            ->get();

        if ($stats->isEmpty()) {
            return [['name' => 'BELUM ADA DATA', 'value' => 0]];
        }

        return $stats->map(fn($item) => [
            'name' => strtoupper($item->source_platform ?: 'Direct'),
            'value' => (int) $item->total
        ]);
    }

    private function calculateDailyTrends($agentId)
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $count = Lead::where('agent_id', $agentId)->whereDate('created_at', $date->format('Y-m-d'))->count();
            $data[] = ['date' => $date->format('d M'), 'count' => $count];
        }
        return $data;
    }
}