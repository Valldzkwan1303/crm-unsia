<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\User;
use App\Models\Channel;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. STATISTIK UTAMA
        $totalLeads = Lead::count();
        $activeAgents = User::where('role', 'agent')->where('is_active', true)->count();
        $registeredLeads = Lead::where('status', 'active')->count();
        
        // Total Komisi dari seluruh Wallet Agen
        $totalCommission = Wallet::sum('balance') ?? 0;

        // Hitung Closing Rate (%)
        $closingRate = $totalLeads > 0 ? round(($registeredLeads / $totalLeads) * 100, 1) : 0;

        // 2. DATA GRAFIK SUMBER SOSMED (PIE CHART)
        $sourceData = Lead::select('source_platform', DB::raw('count(*) as total'))
            ->groupBy('source_platform')
            ->get()
            ->map(function($item) {
                return [
                    'name' => strtoupper($item->source_platform ?: 'Direct'),
                    'value' => $item->total
                ];
            });

        // 3. DATA GRAFIK PERFORMA KANAL (BAR CHART)
        $channelData = Channel::withCount('leads')->get()->map(function($channel) {
            return [
                'name' => $channel->name,
                'leads' => $channel->leads_count
            ];
        });

        // 4. DATA PERFORMA MITRA (DONUT CHART)
        $agentPerformance = User::where('role', 'agent')
            ->withCount(['leads' => fn($q) => $q->where('status', 'active')])
            ->get()
            ->map(fn($agent) => [
                'name' => $agent->name,
                'value' => $agent->leads_count
            ])
            ->filter(fn($item) => $item['value'] > 0)
            ->values();

        return response()->json([
            'stats' => [
                'total_leads' => $totalLeads,
                'active_agents' => $activeAgents,
                'closing_rate' => $closingRate,
                'total_commission' => (float)$totalCommission,
            ],
            'source_data' => $sourceData,
            'channel_data' => $channelData,
            'agent_performance' => $agentPerformance
        ]);
    }
}