<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Get all services (public)
     */
    public function index()
    {
        $services = Service::where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Get all services including inactive (admin)
     */
    public function adminIndex()
    {
        $services = Service::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Create new service (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|in:kg,pcs,item',
            'is_active' => 'boolean',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $service
        ], 201);
    }

    /**
     * Update service (admin)
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'unit' => 'sometimes|string|in:kg,pcs,item',
            'is_active' => 'sometimes|boolean',
        ]);

        $service->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully',
            'data' => $service
        ]);
    }

    /**
     * Delete service (admin)
     */
    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }
}
