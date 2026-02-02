interface OrderHistory {
    trackingId: string;
    customerName: string;
    timestamp: number;
}

const STORAGE_KEY = 'laundry_order_history';
const MAX_DAYS = 7;

// Simpan order baru ke localStorage
export function saveOrder(trackingId: string, customerName: string): void {
    const orders = getOrders();
    const newOrder: OrderHistory = {
        trackingId,
        customerName,
        timestamp: Date.now(),
    };

    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    clearOldOrders();
}

// Ambil semua orders dari localStorage
function getOrders(): OrderHistory[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Hapus orders yang lebih dari MAX_DAYS hari
export function clearOldOrders(): void {
    const orders = getOrders();
    const maxAge = MAX_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const now = Date.now();

    const filtered = orders.filter(order => now - order.timestamp < maxAge);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Format label grup berdasarkan tanggal
export function formatDateGroup(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time untuk perbandingan tanggal saja
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Hari Ini';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Kemarin';
    } else {
        // Format: "Senin, 2 Feb 2026"
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
}

// Format waktu untuk display
export function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Ambil orders dengan grouping per hari
export function getGroupedOrders(): Record<string, OrderHistory[]> {
    clearOldOrders();
    const orders = getOrders();

    // Sort by timestamp descending (newest first)
    orders.sort((a, b) => b.timestamp - a.timestamp);

    // Group by date
    const grouped: Record<string, OrderHistory[]> = {};

    orders.forEach(order => {
        const groupLabel = formatDateGroup(order.timestamp);
        if (!grouped[groupLabel]) {
            grouped[groupLabel] = [];
        }
        grouped[groupLabel].push(order);
    });

    return grouped;
}
