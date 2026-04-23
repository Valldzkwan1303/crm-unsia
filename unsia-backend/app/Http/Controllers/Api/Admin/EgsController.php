<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;        
use App\Models\EgsProfile;  
use App\Models\Lead;        
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EgsController extends Controller
{
    public function index() {
        try {
            $data = User::where('role', 'egs')
                ->with('egsProfile')
                ->withCount(['leadsAsEgs' => function($query) {
                    $query->where('status', 'Registered');
                }])
                ->get();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'nip' => 'required|unique:egs_profiles',
            'department' => 'required'
        ]);

        try {
            return DB::transaction(function() use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->nip),
                    'role' => 'egs',
                    'is_active' => true
                ]);

                EgsProfile::create([
                    'user_id' => $user->id,
                    'nip' => $request->nip,
                    'department' => $request->department
                ]);

                return response()->json(['message' => 'Ambassador EGS Berhasil Ditambahkan']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}