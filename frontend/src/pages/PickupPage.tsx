import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import { saveOrder } from '../utils/orderHistory';
import ThemeToggle from '../components/ThemeToggle';
import './PickupPage.css';

export default function PickupPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_address: '',
        customer_phone: '',
        service_type: 'kiloan',
        order_type: 'pickup',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await publicAPI.createOrder(formData);
            const trackingId = response.data.data.tracking_id;

            // Save to order history
            saveOrder(trackingId, formData.customer_name);

            navigate(`/track/${trackingId}`);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Gagal membuat pesanan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pickup-page">
            <ThemeToggle />
            <div className="container">
                <motion.div
                    className="pickup-form-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="glass-card">
                        <h1 className="form-title">Pesan Pickup</h1>
                        <p className="form-subtitle">Isi form di bawah untuk menjadwalkan pickup cucian Anda</p>

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

                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading ? 'Memproses...' : 'Buat Pesanan'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
