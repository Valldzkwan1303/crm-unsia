<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\User;
use App\Models\AgentProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicLeadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email|unique:users,email',
            'phone' => 'required',
            'prodi_interest' => 'required',
        ]);

        try {
            $regCode = 'REG-' . strtoupper(Str::random(10));
            $agentId = null;
            $channelId = 1;

            if ($request->filled('ref')) {
                $profile = AgentProfile::where('referral_code', $request->ref)->first();
                if ($profile) {
                    $agentId = $profile->user_id;
                    $channelId = ($profile->type === 'sgs') ? 4 : ($profile->type === 'egs' ? 5 : 2);
                }
            }

            $lead = Lead::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'prodi_interest' => $request->prodi_interest,
                'agent_id' => $agentId,
                'channel_id' => $channelId,
                'registration_code' => $regCode,
                'source_platform' => $request->input('src') ?? 'Direct',
                'status' => 'lead',
            ]);

            return response()->json(['status' => 'success', 'registration_code' => $regCode, 'data' => $lead], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function uploadRegistrationFee(Request $request, $id)
    {
        $request->validate(['payment_proof' => 'required|image|max:2048']);
        $lead = Lead::findOrFail($id);
        $path = $request->file('payment_proof')->store('payments/registration', 'public');

        $lead->update([
            'registration_fee_proof' => $path,
            'notes' => 'Menunggu aktivasi akun oleh partner/admin.'
        ]);
        return response()->json(['message' => 'Bukti pendaftaran berhasil diunggah!']);
    }

    public function checkStatus($code)
    {
        $lead = Lead::where('registration_code', $code)->with('agent.agentProfile')->first();

        if (!$lead) {
            return response()->json(['message' => 'Kode tidak ditemukan'], 404);
        }

        return response()->json([
            'id' => $lead->id,
            'name' => $lead->name,
            'email' => $lead->email,
            'status' => $lead->status,
            'agent_code' => $lead->agent->agentProfile->referral_code ?? null
        ]);
    }

    public function getAgentInfo($code)
    {
        $profile = AgentProfile::where('referral_code', $code)->first();

        if (!$profile) {
            return response()->json(['name' => 'Partner Resmi'], 404);
        }

        return response()->json([
            'name' => $profile->user->name,
            'type' => $profile->type
        ]);
    }
}