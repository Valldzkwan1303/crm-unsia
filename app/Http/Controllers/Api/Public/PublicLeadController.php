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
            'phone' => 'required|string',
            'prodi_interest' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $agentId = null;
            $channelId = 1;

            $ref = $request->input('ref');
            $source = $request->input('src') ?? $request->input('source') ?? 'direct';

            $partner = AgentProfile::where('referral_code', $ref)->first();
            if ($ref) {
                $sgs = DB::table('sgs_profiles')->where('nim', $ref)->first();
                if ($sgs) {
                    $agentId = $sgs->user_id;
                    $channelId = 4;
                }
                if (!$agentId) {
                    $egs = DB::table('egs_profiles')->where('nip', $ref)->first();
                    if ($egs) {
                        $agentId = $egs->user_id;
                        $channelId = 5;
                    }
                }
                if (!$agentId) {
                    $partner = AgentProfile::where('referral_code', $ref)->first();
                    if ($partner) {
                        $agentId = $partner->user_id;
                        if ($partner->type === 'sgs')
                            $channelId = 4;
                        elseif ($partner->type === 'egs')
                            $channelId = 5;
                        else
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
                'status' => 'lead'
            ]);

            return response()->json(['status' => 'success', 'registration_code' => $regCode, 'data' => $lead], 201);
        });
    }

    public function uploadRegistrationFee(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,png,jpeg|max:5120'
        ]);

        try {
            $lead = Lead::findOrFail($id);

            if ($request->hasFile('payment_proof')) {
                $path = $request->file('payment_proof')->store('payments/registration', 'public');

                $lead->update([
                    'registration_fee_proof' => $path,
                    'notes' => 'Pendaftar telah mengunggah bukti bayar awal.'
                ]);

                return response()->json(['message' => 'Upload sukses!'], 200);
            }

            return response()->json(['message' => 'File tidak terbaca'], 400);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
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

        if ($profile) {
            return response()->json([
                'name' => $profile->user->name,
                'type' => $profile->type
            ]);
        }

        $sgs = DB::table('sgs_profiles')
            ->join('users', 'sgs_profiles.user_id', '=', 'users.id')
            ->where('sgs_profiles.nim', $code)
            ->select('users.name')
            ->first();

        if ($sgs) {
            return response()->json([
                'name' => $sgs->name,
                'type' => 'sgs'
            ]);
        }

        $egs = DB::table('egs_profiles')
            ->join('users', 'egs_profiles.user_id', '=', 'users.id')
            ->where('egs_profiles.nip', $code)
            ->select('users.name')
            ->first();

        if ($egs) {
            return response()->json([
                'name' => $egs->name,
                'type' => 'egs'
            ]);
        }

        return response()->json(['name' => 'Partner Resmi'], 404);
    }
}
