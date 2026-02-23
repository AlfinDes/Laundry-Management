<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get settings (public - requires admin_id query param, or scoped to logged in admin)
     */
    public function index(Request $request)
    {
        $adminId = null;

        // If user is authenticated (admin route), use their ID
        if ($request->user()) {
            $adminId = $request->user()->id;
        } elseif ($request->has('admin_id')) {
            // Public route with admin_id query param
            $adminId = $request->admin_id;
        }

        if (!$adminId) {
            return response()->json(['data' => (object) []]);
        }

        $settings = Setting::where('admin_id', $adminId)->pluck('value', 'key');
        return response()->json(['data' => $settings]);
    }

    /**
     * Update settings (admin - scoped)
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        $adminId = $request->user()->id;

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['admin_id' => $adminId, 'key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
