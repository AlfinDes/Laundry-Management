<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Get all active services (public - requires admin_id query param)
     */
    public function index(Request $request)
    {
        $query = Service::where('is_active', true);

        // If admin_id is provided, scope to that admin
        if ($request->has('admin_id')) {
            $query->where('admin_id', $request->admin_id);
        }

        $services = $query->get();
        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Get all services including inactive (admin - scoped)
     */
    public function adminIndex(Request $request)
    {
        $services = Service::where('admin_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Create new service (admin - scoped)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|in:kg,pcs,item',
            'is_active' => 'boolean',
        ]);

        $validated['admin_id'] = $request->user()->id;
        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $service
        ], 201);
    }

    /**
     * Update service (admin - scoped)
     */
    public function update(Request $request, $id)
    {
        $service = Service::where('admin_id', $request->user()->id)->find($id);

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
     * Delete service (admin - scoped)
     */
    public function destroy(Request $request, $id)
    {
        $service = Service::where('admin_id', $request->user()->id)->find($id);

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
