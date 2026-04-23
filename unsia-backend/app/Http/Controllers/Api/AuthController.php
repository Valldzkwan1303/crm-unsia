<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\AgentProfile;
use App\Models\Wallet;

class AuthController extends Controller
{
    public function registerAgent(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'phone' => 'required',
            'area' => 'required',
        ]);
        try {
            $result = DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => 'agent',
                    'is_active' => false,
                ]);

                $refCode = 'REF-' . strtoupper(substr(str_replace(' ', '', $request->name), 0, 3)) . '-' . rand(100, 999);

                AgentProfile::create([
                    'user_id' => $user->id,
                    'phone' => $request->phone,
                    'area' => $request->area,
                    'referral_code' => $refCode,
                ]);

                Wallet::create([
                    'user_id' => $user->id,
                    'balance' => 0,
                    'pending_balance' => 0,
                ]);

                return $user;
            });

            return response()->json([
                'message' => 'Registrasi berhasil! Silakan tunggu verifikasi Admin.',
                'user' => $result
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Registrasi gagal: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password yang Anda masukkan salah.'], 401);
        }

        if ($user->is_active == false) {
            return response()->json(['message' => 'Akun Anda sedang menunggu verifikasi Admin. Mohon tunggu.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}