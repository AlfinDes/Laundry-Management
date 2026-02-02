import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import './AdminLayout.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/services', icon: '🧺', label: 'Layanan' },
        { path: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
    ];

    return (
        <div className="admin-layout">
            <ThemeToggle />
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Laundry Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <motion.button
                            key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
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
