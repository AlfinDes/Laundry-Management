import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import './SettingsPage.css';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        laundry_name: 'Premium Laundry',
        whatsapp_number: '628123456789',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await adminAPI.getSettings();
            if (res.data.data) {
                setSettings({
                    laundry_name: res.data.data.laundry_name || 'Premium Laundry',
                    whatsapp_number: res.data.data.whatsapp_number || '628123456789',
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

    if (loading) {
        return <AdminLayout><div className="loading">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="settings-content">
                <div className="dashboard-header-simple">
                    <h1>Pengaturan Bisnis</h1>
                </div>

                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        transition={{ delay: 0.1 }}
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
