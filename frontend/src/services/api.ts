import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Public API
export const publicAPI = {
    // Create pickup request (now requires admin_id)
    createOrder: (data: {
        admin_id: number;
        customer_name: string;
        customer_address: string;
        customer_phone: string;
        service_type: string;
        order_type: string;
    }) => api.post('/orders', data),

    // Track order by tracking ID
    trackOrder: (trackingId: string) => api.get(`/orders/${trackingId}`),

    // Get business settings (public, optionally scoped by admin_id)
    getSettings: (adminId?: number) => api.get('/settings', { params: adminId ? { admin_id: adminId } : {} }),

    // Get active services (public, optionally scoped by admin_id)
    getServices: (adminId?: number) => api.get('/services', { params: adminId ? { admin_id: adminId } : {} }),

    // Get shop info by username
    getShopByUsername: (username: string) => api.get(`/shop/${username}`),

    // Get services for a specific shop
    getShopServices: (adminId: number) => api.get(`/shop/${adminId}/services`),
};

// Admin API
export const adminAPI = {
    // Authentication
    login: (credentials: { username: string; password: string }) =>
        api.post('/admin/login', credentials),

    register: (data: { name: string; username: string; password: string; password_confirmation: string }) =>
        api.post('/admin/register', data),

    logout: () => api.post('/admin/logout'),

    getMe: () => api.get('/admin/me'),

    // Order Management
    getOrders: (params?: {
        status?: string;
        payment_status?: string;
        order_type?: string;
        search?: string;
        page?: number;
    }) => api.get('/admin/orders', { params }),

    getOrder: (id: number) => api.get(`/admin/orders/${id}`),

    updateOrder: (id: number, data: any) => api.put(`/admin/orders/${id}`, data),

    deleteOrder: (id: number) => api.delete(`/admin/orders/${id}`),

    resetOrders: () => api.delete('/admin/orders-reset'),

    // Settings Management
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (settings: Record<string, string>) => api.put('/admin/settings', { settings }),

    // Dashboard Stats
    getStats: () => api.get('/admin/stats'),

    // Service Management
    getServices: () => api.get('/admin/services'),
    createService: (data: any) => api.post('/admin/services', data),
    updateService: (id: number, data: any) => api.put(`/admin/services/${id}`, data),
    deleteService: (id: number) => api.delete(`/admin/services/${id}`),
};

export default api;
