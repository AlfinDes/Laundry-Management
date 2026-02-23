import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import { saveOrder } from '../utils/orderHistory';
import './ShopPage.css';

interface ShopInfo {
    id: number;
    name: string;
    username: string;
    settings: Record<string, string>;
}

export default function ShopPage() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [shop, setShop] = useState<ShopInfo | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [successTrackingId, setSuccessTrackingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_address: '',
        customer_phone: '',
        service_type: 'kiloan',
        order_type: 'pickup',
    });

    useEffect(() => {
        if (username) {
            fetchShopInfo();
        }
    }, [username]);

    const fetchShopInfo = async () => {
        try {
            const res = await publicAPI.getShopByUsername(username!);
            const shopData = res.data.data;
            setShop(shopData);

            // Fetch services for this shop
            const servicesRes = await publicAPI.getShopServices(shopData.id);
            setServices(servicesRes.data.data || []);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setNotFound(true);
            }
            console.error('Error fetching shop:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shop) return;
        setSubmitting(true);

        try {
            const response = await publicAPI.createOrder({
                admin_id: shop.id,
                ...formData,
            });
            const trackingId = response.data.data.tracking_id;

            // Save to order history
            saveOrder(trackingId, formData.customer_name);

            // Show success inline instead of navigating away
            setSuccessTrackingId(trackingId);

            // Reset form for next order
            setFormData({
                customer_name: '',
                customer_address: '',
                customer_phone: '',
                service_type: 'kiloan',
                order_type: 'pickup',
            });
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Gagal membuat pesanan. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="shop-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Memuat info laundry...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="shop-page">
                <div className="container">
                    <motion.div
                        className="not-found-state glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="not-found-icon">🔍</div>
                        <h2>Laundry Tidak Ditemukan</h2>
                        <p>Link laundry "<strong>{username}</strong>" tidak tersedia.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Kembali ke Beranda
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const laundryName = shop?.settings?.laundry_name || shop?.name || 'Laundry';

    return (
        <div className="shop-page">
            <div className="container">
                {/* Shop Header */}
                <motion.div
                    className="shop-header glass-card"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="shop-icon">🧺</div>
                    <h1 className="shop-name">{laundryName}</h1>
                    <p className="shop-subtitle">Pesan layanan laundry dengan mudah</p>
                </motion.div>

                {/* Services List */}
                {services.length > 0 && (
                    <motion.div
                        className="shop-services"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="section-title">Daftar Harga</h2>
                        <div className="services-grid">
                            {services.map((service: any) => (
                                <div key={service.id} className="service-item glass-card">
                                    <span className="service-name">{service.name}</span>
                                    <span className="service-price">
                                        Rp {Math.floor(service.price).toLocaleString('id-ID')}
                                        <small>/{service.unit}</small>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Success Message */}
                {successTrackingId && (
                    <motion.div
                        className="success-message glass-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', padding: '2rem', marginBottom: '1.5rem' }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Pesanan Berhasil!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Kode Pelacakan Anda:
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                            {successTrackingId}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={() => navigate(`/track/${successTrackingId}`)}>
                                Lacak Pesanan
                            </button>
                            <button className="btn btn-secondary" onClick={() => setSuccessTrackingId(null)}>
                                Pesan Lagi
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Order Form */}
                <motion.div
                    className="order-form-container glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="form-title">Buat Pesanan</h2>
                    <p className="form-subtitle">Isi form di bawah untuk memesan layanan laundry</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nama Lengkap</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Masukkan nama Anda"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alamat Lengkap</label>
                            <textarea
                                className="input"
                                rows={3}
                                placeholder="Jl. Contoh No. 123, Jakarta"
                                value={formData.customer_address}
                                onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nomor WhatsApp</label>
                            <input
                                type="tel"
                                className="input"
                                placeholder="081234567890"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Jenis Layanan</label>
                                <select
                                    className="input"
                                    value={formData.service_type}
                                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                >
                                    <option value="kiloan">Kiloan</option>
                                    <option value="satuan">Satuan (Dry Clean)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipe Pesanan</label>
                                <select
                                    className="input"
                                    value={formData.order_type}
                                    onChange={(e) => setFormData({ ...formData, order_type: e.target.value })}
                                >
                                    <option value="pickup">Pickup (Dijemput)</option>
                                    <option value="dropoff">Dropoff (Antar Sendiri)</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                            {submitting ? 'Memproses...' : '🧺 Buat Pesanan'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
