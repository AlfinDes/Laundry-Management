import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import './SettingsPage.css';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [settings, setSettings] = useState({
        laundry_name: 'Premium Laundry',
        whatsapp_number: '628123456789',
        fonnte_token: '',
    });

    useEffect(() => {
        fetchSettings();
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        try {
            const res = await adminAPI.getMe();
            setAdminUsername(res.data.data.username);
        } catch (error) {
            console.error('Error fetching admin info:', error);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await adminAPI.getSettings();
            if (res.data.data) {
                setSettings({
                    laundry_name: res.data.data.laundry_name || 'Premium Laundry',
                    whatsapp_number: res.data.data.whatsapp_number || '628123456789',
                    fonnte_token: res.data.data.fonnte_token || '',
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminAPI.updateSettings(settings);
            alert('Pengaturan berhasil disimpan!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Gagal menyimpan pengaturan.');
        } finally {
            setSaving(false);
        }
    };

    const handleResetData = async () => {
        if (window.confirm('APAKAH ANDA YAKIN? Data akan dihapus permanen!')) {
            if (window.confirm('Ini adalah konfirmasi terakhir. Semua data pesanan akan hilang!')) {
                try {
                    await adminAPI.resetOrders();
                    alert('Data pesanan berhasil direset.');
                } catch (error) {
                    console.error('Error resetting data:', error);
                    alert('Gagal mereset data.');
                }
            }
        }
    };

    const shopUrl = `${window.location.origin}/s/${adminUsername}`;

    const copyShopLink = () => {
        navigator.clipboard.writeText(shopUrl);
        alert('Link toko berhasil disalin!');
    };

    if (loading) {
        return <AdminLayout><div className="loading">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="settings-content">
                <div className="dashboard-header-simple">
                    <h1>Pengaturan Bisnis</h1>
                </div>

                {/* Shop Link Section */}
                {adminUsername && (
                    <motion.div
                        className="settings-card shop-link-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>🔗 Link Toko Anda</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                            Bagikan link ini ke pelanggan Anda:
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <code style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                background: 'var(--bg-secondary)',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                flex: 1,
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {shopUrl}
                            </code>
                            <button className="btn btn-primary btn-sm" onClick={copyShopLink}>
                                Salin
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label className="form-label">Nama Laundry</label>
                            <input
                                type="text"
                                className="input"
                                value={settings.laundry_name}
                                onChange={(e) => setSettings({ ...settings, laundry_name: e.target.value })}
                                placeholder="Contoh: Budi Laundry Premium"
                                required
                            />
                            <small className="help-text">Nama ini akan muncul di web dan pesan WhatsApp.</small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nomor WhatsApp Admin</label>
                            <input
                                type="text"
                                className="input"
                                value={settings.whatsapp_number}
                                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                placeholder="Contoh: 628123456789"
                                required
                            />
                            <small className="help-text">Gunakan format 62 (tanpa tanda + atau spasi) untuk integrasi WhatsApp.</small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Fonnte API Token</label>
                            <input
                                type="text"
                                className="input"
                                value={settings.fonnte_token}
                                onChange={(e) => setSettings({ ...settings, fonnte_token: e.target.value })}
                                placeholder="Masukkan token dari dashboard Fonnte"
                            />
                            <small className="help-text">
                                Token ini digunakan untuk mengirim notifikasi WhatsApp otomatis ke pelanggan saat pesanan selesai.
                                Dapatkan token dari <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>fonnte.com</a>.
                            </small>
                        </div>

                        <div className="settings-footer">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                <div className="danger-zone-container">
                    <h2 className="danger-zone-title">Dangerous Zone</h2>
                    <motion.div
                        className="danger-zone-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="danger-item">
                            <div className="danger-info">
                                <h3>Reset Data Pesanan</h3>
                                <p>Hapus semua data pesanan dari database. Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleResetData}
                            >
                                Reset Semua Data
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
}
