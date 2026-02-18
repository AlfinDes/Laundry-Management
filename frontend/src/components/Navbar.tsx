import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getGroupedOrders, formatTime } from '../utils/orderHistory';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState<Record<string, any[]>>({});
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Hari Ini']));

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (historyOpen) {
            const grouped = getGroupedOrders();
            setOrderHistory(grouped);
        }
    }, [historyOpen]);

    // Close drawer when navigating
    useEffect(() => {
        setHistoryOpen(false);
    }, [location]);

    const toggleGroup = (label: string) => {
        const next = new Set(expandedGroups);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        setExpandedGroups(next);
    };

    const totalOrders = Object.values(orderHistory).reduce((sum, arr) => sum + arr.length, 0);

    const handlePriceClick = () => {
        if (location.pathname === '/') {
            const el = document.getElementById('pricing-section');
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className={`customer-navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">🧺</span>
                        <span className="logo-text">LaundryKu</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="navbar-links">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            Beranda
                        </Link>
                        <Link
                            to="/pickup"
                            className={`nav-link ${location.pathname === '/pickup' ? 'active' : ''}`}
                        >
                            Pesan Pickup
                        </Link>
                        {location.pathname === '/' ? (
                            <button className="nav-link" onClick={handlePriceClick}>
                                Daftar Harga
                            </button>
                        ) : (
                            <Link to="/#pricing-section" className="nav-link">
                                Daftar Harga
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="navbar-actions">
                        <button
                            className="nav-history-btn"
                            onClick={() => setHistoryOpen(true)}
                            title="Riwayat Pesanan"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>Riwayat</span>
                            {totalOrders > 0 && (
                                <span className="history-badge">{totalOrders}</span>
                            )}
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Order History Drawer */}
            <AnimatePresence>
                {historyOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="drawer-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setHistoryOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            className="history-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            <div className="drawer-header">
                                <h2 className="drawer-title">Riwayat Pesanan</h2>
                                <button
                                    className="drawer-close"
                                    onClick={() => setHistoryOpen(false)}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            <div className="drawer-body">
                                {Object.keys(orderHistory).length === 0 ? (
                                    <div className="drawer-empty">
                                        <div className="empty-icon">📦</div>
                                        <p>Belum ada riwayat pesanan</p>
                                        <Link to="/pickup" className="btn btn-primary">
                                            Buat Pesanan
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="drawer-groups">
                                        {Object.entries(orderHistory).map(([label, orders]) => (
                                            <div key={label} className="drawer-group">
                                                <button
                                                    className="drawer-group-header"
                                                    onClick={() => toggleGroup(label)}
                                                >
                                                    <span className="drawer-group-label">{label}</span>
                                                    <span className="drawer-group-count">{orders.length} pesanan</span>
                                                    <span className={`drawer-group-icon ${expandedGroups.has(label) ? 'expanded' : ''}`}>
                                                        ▼
                                                    </span>
                                                </button>
                                                <AnimatePresence>
                                                    {expandedGroups.has(label) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.25 }}
                                                            style={{ overflow: 'hidden' }}
                                                        >
                                                            {orders.map((order) => (
                                                                <Link
                                                                    key={order.trackingId}
                                                                    to={`/track/${order.trackingId}`}
                                                                    className="drawer-order-card"
                                                                >
                                                                    <div className="drawer-order-info">
                                                                        <span className="drawer-tracking-id">{order.trackingId}</span>
                                                                        <span className="drawer-customer-name">{order.customerName}</span>
                                                                    </div>
                                                                    <span className="drawer-order-time">{formatTime(order.timestamp)}</span>
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
