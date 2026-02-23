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
     * Admin registration
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:admins,username|regex:/^[a-z0-9\-]+$/',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'username.regex' => 'Username hanya boleh huruf kecil, angka, dan tanda hubung (-).',
            'username.unique' => 'Username sudah digunakan.',
        ]);

        $admin = Admin::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        // Create token
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil',
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'username' => $admin->username,
                ],
                'token' => $token,
            ]
        ], 201);
    }

    /**
     * Admin login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah.'],
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

    /**
     * Get admin info by username (public - for shop page)
     */
    public function getByUsername($username)
    {
        $admin = Admin::where('username', $username)->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Laundry tidak ditemukan'
            ], 404);
        }

        // Get public settings for this admin
        $settings = $admin->settings()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'username' => $admin->username,
                'settings' => $settings,
            ]
        ]);
    }
}
