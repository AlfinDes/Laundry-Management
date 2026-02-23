import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import './AdminLogin.css';

export default function AdminRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Password dan konfirmasi password tidak cocok.');
            setLoading(false);
            return;
        }

        try {
            const response = await adminAPI.register(formData);
            localStorage.setItem('admin_token', response.data.data.token);
            localStorage.setItem('admin_name', response.data.data.admin.name);
            localStorage.setItem('admin_data', JSON.stringify(response.data.data.admin));
            navigate('/admin');
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors) {
                const firstError = Object.values(errors).flat()[0] as string;
                setError(firstError);
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <motion.div
                className="login-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="glass-card">
                    <div className="login-header">
                        <h1>Daftar Admin</h1>
                        <p className="text-secondary">Buat akun untuk mengelola laundry Anda</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nama Laundry / Pemilik</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Contoh: Berkah Laundry"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Username (untuk link toko)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="contoh: berkah-laundry"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, '') })}
                                required
                            />
                            <small className="help-text">
                                Link toko Anda: <strong>laundryku.fun/s/{formData.username || '...'}</strong>
                            </small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    placeholder="Minimal 6 karakter"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Konfirmasi Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input"
                                placeholder="Ulangi password"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Memproses...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="register-link" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p className="text-secondary">
                            Sudah punya akun? <Link to="/admin/login" style={{ color: 'var(--primary)' }}>Login di sini</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
