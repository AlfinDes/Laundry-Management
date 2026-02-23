<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AdminOrderController extends Controller
{
    /**
     * Get all orders for the authenticated admin with optional filters
     */
    public function index(Request $request)
    {
        $adminId = $request->user()->id;
        $query = Order::where('admin_id', $adminId);

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
     * Get single order details (scoped to authenticated admin)
     */
    public function show(Request $request, $id)
    {
        $order = Order::where('admin_id', $request->user()->id)->find($id);

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
     * Update order (status, weight, items, price) - scoped to authenticated admin
     */
    public function update(Request $request, $id)
    {
        $order = Order::where('admin_id', $request->user()->id)->find($id);

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

        $oldStatus = $order->status;
        $order->fill($validated);

        // Auto-calculate price if weight or items changed and no specific price was provided
        if (($request->has('weight') || $request->has('items')) && !$request->has('total_price')) {
            $order->total_price = $order->calculatePrice();
        }

        $order->save();

        // Send WhatsApp notification if status changed to completed
        if ($oldStatus !== 'completed' && $order->status === 'completed') {
            $this->sendWhatsAppNotification($order);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order
        ]);
    }

    /**
     * Delete/Archive order (scoped to authenticated admin)
     */
    public function destroy(Request $request, $id)
    {
        $order = Order::where('admin_id', $request->user()->id)->find($id);

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
     * Get dashboard statistics (scoped to authenticated admin)
     */
    public function stats(Request $request)
    {
        $adminId = $request->user()->id;

        $totalOrders = Order::where('admin_id', $adminId)->count();
        $activeOrders = Order::where('admin_id', $adminId)->whereIn('status', ['pending', 'picked_up', 'washing', 'ironing'])->count();
        $completedOrders = Order::where('admin_id', $adminId)->where('status', 'completed')->count();
        $totalRevenue = Order::where('admin_id', $adminId)->where('payment_status', 'paid')->sum('total_price');
        $pendingPickups = Order::where('admin_id', $adminId)->where('status', 'pending')->where('order_type', 'pickup')->count();

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
     * Reset/Delete all orders for the authenticated admin
     */
    public function reset(Request $request)
    {
        Order::where('admin_id', $request->user()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'All orders have been reset successfully'
        ]);
    }

    /**
     * Send WhatsApp notification via Fonnte when order is completed
     */
    private function sendWhatsAppNotification(Order $order)
    {
        try {
            $admin = Admin::find($order->admin_id);
            if (!$admin)
                return;

            $fonnteToken = $admin->getSetting('fonnte_token');
            if (!$fonnteToken) {
                Log::info('Fonnte token not configured for admin: ' . $admin->id);
                return;
            }

            $laundryName = $admin->getSetting('laundry_name', $admin->name);

            $message = "Halo Kak {$order->customer_name}! 👋\n\n"
                . "Pesanan laundry Anda sudah *SELESAI* ✅\n\n"
                . "📋 Detail Pesanan:\n"
                . "🔖 Kode: *{$order->tracking_id}*\n"
                . "💰 Total: Rp " . number_format($order->total_price, 0, ',', '.') . "\n"
                . "💳 Pembayaran: " . ($order->payment_status === 'paid' ? 'Lunas ✅' : 'Belum Bayar ❌') . "\n\n"
                . "Silakan ambil cucian Anda atau tunggu pengiriman.\n"
                . "Terima kasih telah menggunakan layanan *{$laundryName}*! 🙏";

            // Format phone number for Fonnte (ensure starts with 62)
            $phone = $order->customer_phone;
            if (str_starts_with($phone, '0')) {
                $phone = '62' . substr($phone, 1);
            } elseif (str_starts_with($phone, '+')) {
                $phone = substr($phone, 1);
            }

            $response = Http::withHeaders([
                'Authorization' => $fonnteToken,
            ])->post('https://api.fonnte.com/send', [
                        'target' => $phone,
                        'message' => $message,
                    ]);

            Log::info('Fonnte WA notification sent', [
                'order_id' => $order->id,
                'phone' => $phone,
                'response_status' => $response->status(),
                'response_body' => $response->json(),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send WhatsApp notification', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
