import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { Order, DashboardStats } from '../../types';
import AdminLayout from '../../components/AdminLayout';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [editForm, setEditForm] = useState({
        weight: '',
        total_price: '',
        payment_status: '',
        status: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            const [statsRes, ordersRes, servicesRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getOrders({ status: filter || undefined }),
                adminAPI.getServices(),
            ]);
            setStats(statsRes.data.data);
            setOrders(ordersRes.data.data.data);
            setServices(servicesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-calculate price when weight or editingOrder changes
    useEffect(() => {
        if (!editingOrder || !editForm.weight || services.length === 0) return;

        const weight = parseFloat(editForm.weight);
        if (isNaN(weight)) return;

        const serviceType = editingOrder.service_type; // 'kiloan', 'satuan'
        let rate = 0;

        if (serviceType === 'kiloan') {
            // Match service with unit 'kg' or name containing 'Kiloan'
            const service = services.find(s =>
                s.unit === 'kg' || s.name.toLowerCase().includes('kiloan')
            );
            if (service) rate = parseFloat(service.price);
        } else if (serviceType === 'satuan') {
            // Match service with unit 'pcs' or name containing 'Satuan'
            const service = services.find(s =>
                s.unit === 'pcs' || s.name.toLowerCase().includes('satuan')
            );
            if (service) rate = parseFloat(service.price);
        }

        if (rate > 0) {
            const total = weight * rate;
            // Only update if it's different to avoid loops or overwriting manual edits immediately
            setEditForm(prev => {
                const newTotal = total.toString();
                if (prev.total_price !== newTotal && !requestAnimationFrame) { // Simple check
                    return { ...prev, total_price: newTotal };
                }
                return { ...prev, total_price: newTotal };
            });
        }
    }, [editForm.weight, editingOrder, services]);

    const handleEditClick = (order: Order) => {
        setEditingOrder(order);
        setEditForm({
            weight: order.weight?.toString() || '',
            total_price: order.total_price?.toString() || '',
            payment_status: order.payment_status,
            status: order.status,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingOrder) return;

        try {
            const updateData: any = {
                status: editForm.status,
                payment_status: editForm.payment_status,
            };

            if (editForm.weight) {
                updateData.weight = parseFloat(editForm.weight);
            }

            if (editForm.total_price) {
                updateData.total_price = parseFloat(editForm.total_price);
            }

            await adminAPI.updateOrder(editingOrder.id, updateData);
            setEditingOrder(null);
            fetchData();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Gagal update order. Silakan coba lagi.');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            pending: 'badge-warning',
            picked_up: 'badge-primary',
            washing: 'badge-primary',
            ironing: 'badge-primary',
            ready: 'badge-success',
            delivered: 'badge-success',
            completed: 'badge-success',
        };
        return badges[status] || 'badge-primary';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Menunggu Pickup',
            picked_up: 'Sudah Diambil',
            washing: 'Sedang Dicuci',
            ironing: 'Sedang Disetrika',
            ready: 'Siap Diambil',
            delivered: 'Dalam Pengiriman',
            completed: 'Selesai',
        };
        return labels[status] || status;
    };

    if (loading) {
        return <AdminLayout><div className="loading">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="admin-dashboard-content">
                <div className="dashboard-header-simple">
                    <h1>Dashboard Admin</h1>
                </div>

                <motion.div
                    className="stats-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-value">{stats?.total_orders || 0}</div>
                        <div className="stat-label">Total Pesanan</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-value">{stats?.active_orders || 0}</div>
                        <div className="stat-label">Pesanan Aktif</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-value">{stats?.completed_orders || 0}</div>
                        <div className="stat-label">Selesai</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">Rp {Math.floor(Number(stats?.total_revenue || 0)).toLocaleString('id-ID')}</div>
                        <div className="stat-label">Total Pendapatan</div>
                    </div>
                </motion.div>

                <div className="orders-section">
                    <div className="section-header">
                        <h2>Manajemen Pesanan</h2>
                        <select className="input filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu Pickup</option>
                            <option value="picked_up">Sudah Diambil</option>
                            <option value="washing">Sedang Dicuci</option>
                            <option value="ironing">Sedang Disetrika</option>
                            <option value="ready">Siap Diambil</option>
                            <option value="delivered">Dalam Pengiriman</option>
                            <option value="completed">Selesai</option>
                        </select>
                    </div>

                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID Pelacakan</th>
                                    <th>Pelanggan</th>
                                    <th>Layanan</th>
                                    <th>Status</th>
                                    <th>Harga</th>
                                    <th>Pembayaran</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>{order.tracking_id}</strong></td>
                                        <td>{order.customer_name}</td>
                                        <td>{order.service_type}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td>{order.total_price ? `Rp ${Math.floor(Number(order.total_price)).toLocaleString('id-ID')}` : '-'}</td>
                                        <td>
                                            <span className={`badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                                {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleEditClick(order)}
                                            >
                                                Ubah
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {editingOrder && (
                    <div className="modal-overlay" onClick={() => setEditingOrder(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Ubah Pesanan - {editingOrder.tracking_id}</h2>
                                <button className="modal-close" onClick={() => setEditingOrder(null)}>×</button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Pelanggan</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={editingOrder.customer_name}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Jenis Layanan</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={editingOrder.service_type}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        {editingOrder.service_type === 'kiloan' ? 'Berat (kg)' : 'Jumlah (pcs/item)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input"
                                        placeholder={editingOrder.service_type === 'kiloan' ? 'Masukkan berat cucian' : 'Masukkan jumlah item'}
                                        value={editForm.weight}
                                        onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Total Harga (Rp)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Masukkan total harga"
                                        value={editForm.total_price}
                                        onChange={(e) => setEditForm({ ...editForm, total_price: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="input"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    >
                                        <option value="pending">Menunggu Pickup</option>
                                        <option value="picked_up">Sudah Diambil</option>
                                        <option value="washing">Sedang Dicuci</option>
                                        <option value="ironing">Sedang Disetrika</option>
                                        <option value="ready">Siap Diambil</option>
                                        <option value="delivered">Dalam Pengiriman</option>
                                        <option value="completed">Selesai</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status Pembayaran</label>
                                    <select
                                        className="input"
                                        value={editForm.payment_status}
                                        onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })}
                                    >
                                        <option value="unpaid">Belum Bayar</option>
                                        <option value="paid">Lunas</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditingOrder(null)}>
                                    Batal
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveEdit}>
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
