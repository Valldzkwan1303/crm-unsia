<?php

namespace App\Http\Controllers\Api\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgentProfile;
use Illuminate\Support\Facades\Auth;

class AgentProfileController extends Controller
{
    public function updateReferralCode(Request $request)
    {
        $request->validate([
            'referral_code' => 'required|string|min:3|max:20|unique:agent_profiles,referral_code,' . Auth::user()->agentProfile->id,
        ], [
            'referral_code.unique' => 'Kode ini sudah digunakan oleh mitra lain. Silakan cari nama lain.'
        ]);

        $profile = AgentProfile::where('user_id', Auth::id())->first();
        $profile->update([
            'referral_code' => strtoupper($request->referral_code)
        ]);

        return response()->json([
            'message' => 'Kode Referral berhasil diperbarui!',
            'new_code' => $profile->referral_code
        ]);
    }
}