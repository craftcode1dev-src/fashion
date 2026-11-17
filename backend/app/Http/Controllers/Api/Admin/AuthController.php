<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The provided credentials do not match our records.',
            ], 401);
        }

        // Return a session token for admin requests
        $token = 'valere_token_' . hash('sha256', $user->id . $user->email . now());

        return response()->json([
            'status' => 'success',
            'message' => 'Authenticated successfully.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'Creative Director / Administrator',
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = User::first(); // Demo admin
        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user ? $user->id : 1,
                'name' => $user ? $user->name : 'Maison Valère Director',
                'email' => $user ? $user->email : 'admin@maisonvalere.com',
                'role' => 'Creative Director / Administrator',
            ],
        ]);
    }

    public function logout()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully.',
        ]);
    }
}
