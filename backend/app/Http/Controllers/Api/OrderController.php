<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Create a new pickup request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'required|string',
            'customer_phone' => 'required|string|max:20',
            'service_type' => 'required|in:kiloan,satuan',
            'order_type' => 'required|in:pickup,dropoff',
        ]);

        // Generate unique tracking ID with format DDMMYY-XXX
        $order = Order::create([
            'tracking_id' => Order::generateTrackingId(),
            'customer_name' => $validated['customer_name'],
            'customer_address' => $validated['customer_address'],
            'customer_phone' => $validated['customer_phone'],
            'service_type' => $validated['service_type'],
            'order_type' => $validated['order_type'],
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pickup request created successfully',
            'data' => [
                'tracking_id' => $order->tracking_id,
                'customer_name' => $order->customer_name,
                'order_type' => $order->order_type,
                'status' => $order->status,
            ]
        ], 201);
    }

    /**
     * Track order by tracking ID
     */
    public function track($trackingId)
    {
        $order = Order::where('tracking_id', $trackingId)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'tracking_id' => $order->tracking_id,
                'customer_name' => $order->customer_name,
                'customer_address' => $order->customer_address,
                'customer_phone' => $order->customer_phone,
                'service_type' => $order->service_type,
                'order_type' => $order->order_type,
                'status' => $order->status,
                'weight' => $order->weight,
                'items' => $order->items,
                'total_price' => $order->total_price,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $order->updated_at->format('Y-m-d H:i:s'),
            ]
        ]);
    }

}
