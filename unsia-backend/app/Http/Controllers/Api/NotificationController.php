<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lead;
use App\Models\Payout;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function getCounts()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['unread_count' => 0, 'list' => []]);
            }

            $list = [];
            $count = 0;

            if ($user->role === 'admin') {
                $pendingAgents = User::where('role', 'agent')
                    ->where('is_active', false)
                    ->latest()
                    ->take(10)
                    ->get();
                
                $count = $pendingAgents->count();
                foreach ($pendingAgents as $agent) {
                    $list[] = [
                        'id' => 'agent_'.$agent->id,
                        'title' => 'Pendaftaran Agen',
                        'message' => $agent->name . ' menunggu verifikasi.',
                        'time' => $agent->created_at->diffForHumans(),
                        'created_at' => $agent->created_at
                    ];
                }
            } else {
                $newLeads = Lead::where('agent_id', $user->id)
                    ->whereIn('status', ['lead', 'New'])
                    ->latest()
                    ->take(5)
                    ->get();

                foreach ($newLeads as $lead) {
                    $list[] = [
                        'id' => 'lead_'.$lead->id,
                        'title' => 'Pendaftar Baru!',
                        'message' => $lead->name . ' mendaftar via link Anda.',
                        'time' => $lead->created_at->diffForHumans(),
                        'created_at' => $lead->created_at
                    ];
                }

                $recentPayouts = Payout::where('user_id', $user->id)
                    ->where('status', 'Selesai')
                    ->latest()
                    ->take(5)
                    ->get();

                foreach ($recentPayouts as $payout) {
                    $list[] = [
                        'id' => 'payout_'.$payout->id,
                        'title' => 'Komisi Cair!',
                        'message' => 'Komisi Rp ' . number_format($payout->amount, 0, ',', '.') . ' berhasil ditambahkan ke saldo.',
                        'time' => $payout->created_at->diffForHumans(),
                        'created_at' => $payout->created_at
                    ];
                }

                usort($list, function($a, $b) {
                    return $b['created_at'] <=> $a['created_at'];
                });
                $list = array_slice($list, 0, 10);
                $count = count($list);
            }

            return response()->json([
                'unread_count' => $count,
                'list' => collect($list)->map(function($item) {
                    unset($item['created_at']);
                    return $item;
                })->values()
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}