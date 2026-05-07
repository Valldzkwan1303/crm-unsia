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
            $locationId = null;
            $channelId = 1;
            $schoolOrigin = $request->input('school');
            $partnerOrigin = $request->input('partner');
            $locSlug = $request->input('loc');
            $ref = $request->input('ref');

            if ($locSlug) {
                $campaign = DB::table('campaign_locations')->where('location_slug', $locSlug)->first();
                if ($campaign) {
                    $locationId = $campaign->id;
                    $agentId = $campaign->user_id;
                    $channelId = ($campaign->type === 'bts') ? 3 : 6;
                    $schoolOrigin = ($campaign->type === 'bts') ? $campaign->location_name : null;
                    $partnerOrigin = ($campaign->type === 'b2b') ? $campaign->location_name : null;
                }
            }

            if (!$locationId && $ref) {
                $user = User::whereHas('agentProfile', function ($q) use ($ref) {
                    $q->where('referral_code', $ref); })
                    ->orWhereHas('egsProfile', function ($q) use ($ref) {
                        $q->where('nip', $ref); })
                    ->orWhereHas('sgsProfile', function ($q) use ($ref) {
                        $q->where('nim', $ref); })
                    ->orWhereHas('btsProfile', function ($q) use ($ref) {
                        $q->where('bts_id', $ref); })
                    ->orWhereHas('b2bProfile', function ($q) use ($ref) {
                        $q->where('b2b_id', $ref); })
                    ->first();

                if ($user) {
                    $agentId = $user->id;
                    if ($schoolOrigin)
                        $channelId = 3;
                    elseif ($partnerOrigin)
                        $channelId = 6;
                    else {
                        $channelId = ($user->role === 'sgs') ? 4 : (($user->role === 'egs') ? 5 : 2);
                    }

                    if ($schoolOrigin || $partnerOrigin) {
                        $locName = $schoolOrigin ?? $partnerOrigin;

                        $existingLoc = DB::table('campaign_locations')
                            ->where('user_id', $agentId)
                            ->where('location_name', $locName)
                            ->first();

                        if (!$existingLoc) {
                            $locationId = DB::table('campaign_locations')->insertGetId([
                                'user_id' => $agentId,
                                'type' => $schoolOrigin ? 'bts' : 'b2b',
                                'location_name' => $locName,
                                'location_slug' => Str::slug($locName) . '-' . Str::random(5),
                                'created_at' => now(),
                                'updated_at' => now()
                            ]);
                        } else {
                            $locationId = $existingLoc->id;
                        }
                    }
                }
            }

            $lead = Lead::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'prodi_interest' => $request->prodi_interest,
                'agent_id' => $agentId,
                'channel_id' => $channelId,
                'location_id' => $locationId,
                'school_origin' => $schoolOrigin,
                'partner_origin' => $partnerOrigin,
                'registration_code' => 'REG-' . strtoupper(Str::random(10)),
                'source_platform' => strtolower($request->input('src') ?? 'direct'),
                'status' => 'lead'
            ]);

            if ($locationId)
                DB::table('campaign_locations')->where('id', $locationId)->increment('total_leads');

            return response()->json(['status' => 'success', 'registration_code' => $lead->registration_code], 201);
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

        if (!$profile) {
            return response()->json(['name' => 'Partner Resmi'], 404);
        }

        return response()->json([
            'name' => $profile->user->name,
            'type' => $profile->type
        ]);
    }
}