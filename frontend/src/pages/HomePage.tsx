import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { publicAPI } from '../services/api';
import { getGroupedOrders, formatTime } from '../utils/orderHistory';
import ThemeToggle from '../components/ThemeToggle';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const [services, setServices] = useState<any[]>([]);
    const [orderHistory, setOrderHistory] = useState<Record<string, any[]>>({});
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Hari Ini']));

    useEffect(() => {
        fetchServices();
        loadOrderHistory();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await publicAPI.getServices();
            setServices(res.data.data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const loadOrderHistory = () => {
        const grouped = getGroupedOrders();
        setOrderHistory(grouped);
    };

    const toggleGroup = (groupLabel: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupLabel)) {
            newExpanded.delete(groupLabel);
        } else {
            newExpanded.add(groupLabel);
        }
        setExpandedGroups(newExpanded);
    };

    const handleTrackOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            navigate(`/track/${trackingId.trim()}`);
        }
    };

    return (
        <div className="home-page">
            <ThemeToggle />
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
                            Laundry Premium
                            <span className="gradient-text"> Terpercaya</span>
                        </h1>
                        <p className="hero-subtitle">
                            Layanan cuci kiloan dan satuan dengan kualitas terbaik.
                            Lacak status cucian Anda secara real-time.
                        </p>

                        <div className="cta-buttons">
                            <Link to="/pickup" className="btn btn-primary btn-lg">
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
                                        placeholder="Masukkan Tracking ID (contoh: LND-7482)"
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

            {/* Order History Section */}
            {Object.keys(orderHistory).length > 0 && (
                <div className="order-history-section">
                    <div className="container">
                        <h2 className="section-title text-center">Riwayat Pesanan</h2>
                        <div className="history-groups">
                            {Object.entries(orderHistory).map(([groupLabel, orders]) => (
                                <div key={groupLabel} className="history-group">
                                    <button
                                        className="group-header"
                                        onClick={() => toggleGroup(groupLabel)}
                                    >
                                        <span className="group-label">{groupLabel}</span>
                                        <span className="group-count">{orders.length} pesanan</span>
                                        <span className={`group-icon ${expandedGroups.has(groupLabel) ? 'expanded' : ''}`}>
                                            ▼
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {expandedGroups.has(groupLabel) && (
                                            <motion.div
                                                className="group-content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {orders.map((order) => (
                                                    <Link
                                                        key={order.trackingId}
                                                        to={`/track/${order.trackingId}`}
                                                        className="order-history-card"
                                                    >
                                                        <div className="order-info">
                                                            <div className="order-tracking-id">{order.trackingId}</div>
                                                            <div className="order-customer-name">{order.customerName}</div>
                                                        </div>
                                                        <div className="order-time">{formatTime(order.timestamp)}</div>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Services Pricing Section */}
            {services.length > 0 && (
                <div className="pricing-section">
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
