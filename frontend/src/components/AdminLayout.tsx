import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import './AdminLayout.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        navigate('/admin/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/services', icon: '🧺', label: 'Layanan' },
        { path: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
    ];

    return (
        <div className="admin-layout">
            <button className="mobile-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="sidebar-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                    />
                )}
            </AnimatePresence>

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <ThemeToggle />
                <div className="sidebar-header">
                    <h2>Laundry Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <motion.button
                            key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => {
                                navigate(item.path);
                                closeSidebar();
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="btn btn-secondary btn-block" onClick={handleLogout}>
                        Keluar
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}
