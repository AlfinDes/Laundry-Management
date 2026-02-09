<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * Get all orders with optional filters
     */
    public function index(Request $request)
    {
        $query = Order::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by order type
        if ($request->has('order_type')) {
            $query->where('order_type', $request->order_type);
        }

        // Search by customer name or tracking ID
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'ILIKE', "%{$search}%")
                    ->orWhere('tracking_id', 'ILIKE', "%{$search}%");
            });
        }

        // Sort by created_at desc by default
        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Get single order details
     */
    public function show($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Update order (status, weight, items, price)
     */
    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,picked_up,washing,ironing,ready,delivered,completed',
            'weight' => 'sometimes|numeric|min:0',
            'items' => 'sometimes|array',
            'total_price' => 'sometimes|numeric|min:0',
            'payment_status' => 'sometimes|in:unpaid,paid',
        ]);

        $order->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order
        ]);
    }

    /**
     * Delete/Archive order
     */
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        $totalOrders = Order::count();
        $activeOrders = Order::whereIn('status', ['pending', 'picked_up', 'washing', 'ironing'])->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_price');
        $pendingPickups = Order::where('status', 'pending')->where('order_type', 'pickup')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_orders' => $totalOrders,
                'active_orders' => $activeOrders,
                'completed_orders' => $completedOrders,
                'total_revenue' => $totalRevenue,
                'pending_pickups' => $pendingPickups,
            ]
        ]);
    }

    /**
     * Reset/Delete all orders (Development use only)
     */
    public function reset()
    {
        Order::truncate();

        return response()->json([
            'success' => true,
            'message' => 'All orders have been reset successfully'
        ]);
    }
}
