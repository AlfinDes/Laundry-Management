import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import AdUnit from '../components/AdUnit';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const [services, setServices] = useState<any[]>([]);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [defaultAdmin, setDefaultAdmin] = useState<any>(null);

    useEffect(() => {
        fetchShopData();
    }, []);

    const fetchShopData = async () => {
        try {
            // Try to get the admin info from localStorage (set at login)
            const adminData = localStorage.getItem('admin_data');
            let adminUsername = 'admin'; // default fallback

            if (adminData) {
                try {
                    const parsed = JSON.parse(adminData);
                    if (parsed.username) {
                        adminUsername = parsed.username;
                    }
                } catch { }
            }

            // Fetch the admin shop info
            const res = await publicAPI.getShopByUsername(adminUsername);
            const shopData = res.data.data;
            setDefaultAdmin(shopData);
            setSettings(shopData.settings || {});

            // Fetch services for this admin
            const servicesRes = await publicAPI.getShopServices(shopData.id);
            setServices(servicesRes.data.data || []);
        } catch (error) {
            console.error('Error fetching shop info:', error);
            // Fallback: try fetching without admin scope
            try {
                const res = await publicAPI.getSettings();
                setSettings(res.data.data || {});
                const svcRes = await publicAPI.getServices();
                setServices(svcRes.data.data || []);
            } catch (err) {
                console.error('Error in fallback fetch:', err);
            }
        }
    };

    const handleTrackOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            navigate(`/track/${trackingId.trim()}`);
        }
    };

    const shopLink = defaultAdmin ? `/s/${defaultAdmin.username}` : '/pickup';

    return (
        <div className="home-page">
            <motion.div
                className="hero-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <h1 className="hero-title">
                            {settings.laundry_name || 'Laundry Premium'}
                            <span className="gradient-text"> Terpercaya</span>
                        </h1>
                        <p className="hero-subtitle">
                            Layanan cuci kiloan dan satuan dengan kualitas terbaik.
                            Lacak status cucian Anda secara real-time.
                        </p>

                        <div className="cta-buttons">
                            <Link to={shopLink} className="btn btn-primary btn-lg">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Pesan Pickup
                            </Link>
                        </div>

                        <div className="tracking-form">
                            <form onSubmit={handleTrackOrder}>
                                <div className="tracking-input-group">
                                    <input
                                        type="text"
                                        className="input tracking-input"
                                        placeholder="Masukkan Kode Pesanan (contoh: 090226-001)"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-secondary btn-lg">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" />
                                            <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Lacak Pesanan
                                    </button>
                                </div>
                                <p className="tracking-helper">
                                    Format: DDMMYY-XXX (Tanggal pesanan + nomor urut)
                                </p>
                            </form>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="glass-card feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>Kualitas Premium</h3>
                            <p>Deterjen berkualitas tinggi dan pewangi pilihan</p>
                        </div>

                        <div className="glass-card feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Antar Jemput</h3>
                            <p>Gratis pickup dan delivery di area tertentu</p>
                        </div>

                        <div className="glass-card feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Pelacakan Real-time</h3>
                            <p>Pantau status cucian kapan saja</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Ad Slot: Homepage Middle - Between Hero and Services */}
            <div className="container">
                <AdUnit
                    slot="1078591290"
                    format="auto"
                    responsive="true"
                    style={{ margin: '40px 0' }}
                />
            </div>

            {/* Services Pricing Section */}
            {services.length > 0 && (
                <div className="pricing-section" id="pricing-section">
                    <div className="container">
                        <h2 className="section-title text-center">Daftar Harga Layanan</h2>
                        <div className="pricing-grid">
                            {services.map((service) => (
                                <motion.div
                                    key={service.id}
                                    className="pricing-card glass-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h3>{service.name}</h3>
                                    <div className="price">
                                        <span className="price-amount">Rp {Math.floor(service.price).toLocaleString('id-ID')}</span>
                                        <span className="price-unit">/ {service.unit}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="features-section">
                <div className="container">
                    <h2 className="section-title text-center">Kenapa Pilih Kami?</h2>

                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-number">01</div>
                            <h4>Cepat & Tepat Waktu</h4>
                            <p>Layanan express 6 jam tersedia untuk kebutuhan mendesak</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">02</div>
                            <h4>Harga Transparan</h4>
                            <p>Tidak ada biaya tersembunyi, semua jelas di awal</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">03</div>
                            <h4>Aman & Terpercaya</h4>
                            <p>Cucian Anda ditangani dengan hati-hati oleh profesional</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
