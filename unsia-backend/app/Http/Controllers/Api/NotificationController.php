<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // PASTIKAN INI ADA
use App\Models\Lead; // PASTIKAN INI ADA
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
                    ->get();
                
                $count = $pendingAgents->count();
                foreach ($pendingAgents as $agent) {
                    $list[] = [
                        'id' => $agent->id,
                        'title' => 'Pendaftaran Agen',
                        'message' => $agent->name . ' menunggu verifikasi.',
                        'time' => $agent->created_at->diffForHumans(),
                    ];
                }
            } else {
                $newLeads = Lead::where('agent_id', $user->id)
                    ->where('status', 'New')
                    ->latest()
                    ->get();

                $count = $newLeads->count();
                foreach ($newLeads as $lead) {
                    $list[] = [
                        'id' => $lead->id,
                        'title' => 'Prospek Baru',
                        'message' => $lead->name . ' mendaftar via link Anda.',
                        'time' => $lead->created_at->diffForHumans(),
                    ];
                }
            }

            return response()->json([
                'unread_count' => $count,
                'list' => $list
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}