<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Admin login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        \Log::info('Production Login attempt', [
            'username' => $request->username,
            'password_provided_length' => strlen($request->password),
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if ($admin) {
            $check = \Illuminate\Support\Facades\Hash::check($request->password, $admin->password);
            \Log::info('Admin found in production', [
                'username' => $admin->username,
                'password_check' => $check ? 'success' : 'failed',
                'hash_start' => substr($admin->password, 0, 10)
            ]);
        } else {
            \Log::info('Admin NOT found in production', ['username' => $request->username]);
        }

        if (!$admin || !\Illuminate\Support\Facades\Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'username' => $admin->username,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Admin logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get current admin info
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'username' => $request->user()->username,
            ]
        ]);
    }
}
