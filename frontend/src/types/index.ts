export interface Order {
    id: number;
    tracking_id: string;
    admin_id: number;
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    service_type: 'kiloan' | 'satuan';
    order_type: 'pickup' | 'dropoff';
    status: 'pending' | 'picked_up' | 'washing' | 'ironing' | 'ready' | 'delivered' | 'completed';
    weight: number | null;
    items: Array<{ name: string; qty: number; price: number }> | null;
    total_price: number | null;
    payment_status: 'unpaid' | 'paid';
    created_at: string;
    updated_at: string;
}

export interface Admin {
    id: number;
    name: string;
    username: string;
}

export interface DashboardStats {
    total_orders: number;
    active_orders: number;
    completed_orders: number;
    total_revenue: number;
    pending_pickups: number;
}
