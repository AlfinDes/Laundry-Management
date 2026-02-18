import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { publicAPI } from '../services/api';
import { Order } from '../types';
import AdUnit from '../components/AdUnit';
import './TrackingPage.css';

export default function TrackingPage() {
    const { trackingId } = useParams<{ trackingId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (trackingId) {
            fetchData();
        }
    }, [trackingId]);

    const fetchData = async () => {
        try {
            const [orderRes, settingsRes] = await Promise.all([
                publicAPI.trackOrder(trackingId!),
                publicAPI.getSettings(),
            ]);
            setOrder(orderRes.data.data);
            setSettings(settingsRes.data.data || {});
        } catch (err) {
            setError('Order tidak ditemukan');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'picked_up', 'washing', 'ironing', 'ready', 'delivered', 'completed'];
        return steps.indexOf(status);
    };

    const statusLabels: Record<string, string> = {
        pending: 'Menunggu Pickup',
        picked_up: 'Sudah Diambil',
        washing: 'Sedang Dicuci',
        ironing: 'Sedang Disetrika',
        ready: 'Siap Diambil',
        delivered: 'Dalam Pengiriman',
        completed: 'Selesai',
    };

    if (loading) {
        return (
            <div className="tracking-page">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="tracking-page">
                <div className="container">
                    <div className="glass-card text-center">
                        <h2>❌ {error}</h2>
                        <Link to="/" className="btn btn-primary mt-2">Kembali ke Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentStep = getStatusStep(order.status);

    return (
        <div className="tracking-page">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="glass-card">
                        <div className="tracking-info-row">
                            <div className="tracking-id-section">
                                <h1>Lacak Pesanan</h1>
                                <div className="tracking-id">
                                    <span className="badge badge-primary">{order.tracking_id}</span>
                                </div>
                            </div>
                            <div className="qr-code-section">
                                <QRCodeSVG
                                    value={window.location.href}
                                    size={80}
                                    level="H"
                                    includeMargin={false}
                                />
                                <span className="qr-label">Scan untuk Lacak</span>
                            </div>
                        </div>

                        <div className="status-stepper">
                            {Object.entries(statusLabels).map(([key, label], index) => (
                                <div key={key} className={`step ${index <= currentStep ? 'active' : ''}`}>
                                    <div className="step-indicator">
                                        {index < currentStep ? '✓' : index + 1}
                                    </div>
                                    <div className="step-label">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Ad Slot: Below Stepper - Recommended for high visibility */}
                        <AdUnit
                            slot="1078591290"
                            format="auto"
                            responsive="true"
                            style={{ margin: '30px 0' }}
                            className="ad-tracking-page"
                        />

                        <div className="order-details">
                            <h3>Detail Pesanan</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Nama</span>
                                    <span className="detail-value">{order.customer_name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Alamat</span>
                                    <span className="detail-value">{order.customer_address}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Telepon</span>
                                    <span className="detail-value">{order.customer_phone}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Jenis Layanan</span>
                                    <span className="detail-value">{order.service_type}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Berat</span>
                                    {order.weight ? (
                                        <span className="detail-value">{order.weight} kg</span>
                                    ) : (
                                        <span className="detail-value text-secondary" style={{ fontStyle: 'italic' }}>Belum ditimbang</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Total Harga</span>
                                    {order.total_price ? (
                                        <span className="detail-value">Rp {Math.floor(Number(order.total_price)).toLocaleString('id-ID')}</span>
                                    ) : (
                                        <span className="detail-value text-secondary" style={{ fontStyle: 'italic' }}>Menunggu konfirmasi admin</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Status Pembayaran</span>
                                    <span className={`badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                        {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                                    </span>
                                </div>
                            </div>

                            {order.payment_status === 'unpaid' && order.total_price && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp_number || '628123456789'}?text=${encodeURIComponent(
                                        `Halo ${settings.laundry_name || 'Admin'}, saya ingin konfirmasi pembayaran untuk pesanan saya:\n\n` +
                                        `ID Tracking: ${order.tracking_id}\n` +
                                        `Nama: ${order.customer_name}\n` +
                                        `Total: Rp ${Math.floor(Number(order.total_price)).toLocaleString('id-ID')}\n\n` +
                                        `Mohon bantuannya untuk memproses pesanan saya. Terima kasih!`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp"
                                >
                                    <span className="wa-icon">💬</span> Konfirmasi Pembayaran via WhatsApp
                                </a>
                            )}

                            {!order.weight && !order.total_price && (
                                <div className="info-box">
                                    <div className="info-box-icon">ℹ️</div>
                                    <div className="info-box-content">
                                        <strong className="info-box-title">Informasi:</strong>
                                        Berat dan harga akan diupdate oleh admin setelah cucian Anda ditimbang dan diproses.
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/" className="btn btn-secondary btn-block mt-3">Kembali ke Home</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
