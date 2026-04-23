<?php

namespace App\Http\Controllers\Api\Agent;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\AgentProfile;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $profile = AgentProfile::where('user_id', $user->id)->first();
        $activeCount = Lead::where('agent_id', $user->id)
            ->where('status', 'active')
            ->count();

        $currentTierCommission = ($activeCount < 25) ? 500000 : 700000;

        $referrals = Lead::where('agent_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($lead) use ($currentTierCommission) {
                return [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'prodi' => $lead->prodi_interest,
                    'status' => $lead->status,
                    'source' => strtoupper($lead->source_platform ?: 'Direct'),
                    'date' => $lead->created_at->format('d M Y'),
                    'commission_potential' => $currentTierCommission,
                    'registration_fee_proof' => $lead->registration_fee_proof,
                    'phone' => $lead->phone
                ];
            });

        $balance = 0;
        if ($profile) {
            if ($profile->type === 'sgs') {
                $balance = DB::table('sgs_profiles')->where('user_id', $user->id)->value('scholarship_balance');
            } elseif ($profile->type === 'egs') {
                $balance = DB::table('egs_profiles')->where('user_id', $user->id)->value('balance');
            } else {
                $balance = Wallet::where('user_id', $user->id)->value('balance');
            }
        }

        return response()->json([
            'stats' => [
                'total_referrals' => $referrals->count(),
                'commission_balance' => $balance ?? 0,
                'agent_status' => $user->is_active ? 'Active' : 'Pending',
                'agent_code' => $profile->referral_code ?? 'N/A',
                'agent_name' => $user->name,
                'agent_type' => $profile->type ?? 'umum'
            ],
            'referrals' => $referrals,
            'referral_link' => url('/p/' . ($profile->referral_code ?? '')),
            'source_stats' => $this->calculateSourceStats($user->id),
            'chart_data' => $this->calculateDailyTrends($user->id)
        ]);
    }

    private function calculateSourceStats($agentId)
    {
        return Lead::where('agent_id', $agentId)
            ->select('source_platform', DB::raw('count(*) as total'))
            ->groupBy('source_platform')
            ->get()
            ->map(fn($item) => [
                'name' => strtoupper($item->source_platform ?: 'Direct'),
                'value' => (int) $item->total
            ]);
    }

    private function calculateDailyTrends($agentId)
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $count = Lead::where('agent_id', $agentId)
                ->whereDate('created_at', $date->format('Y-m-d'))
                ->count();

            $data[] = [
                'date' => $date->format('d M'),
                'count' => $count
            ];
        }
        return $data;
    }
}