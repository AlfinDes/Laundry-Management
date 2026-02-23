import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import './ServicesPage.css';

interface Service {
    id: number;
    name: string;
    price: number;
    unit: string;
    is_active: boolean;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        unit: 'kg',
        is_active: true,
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await adminAPI.getServices();
            setServices(res.data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            price: service.price.toString(),
            unit: service.unit,
            is_active: service.is_active,
        });
    };

    const handleCreate = () => {
        setIsCreating(true);
        setFormData({
            name: '',
            price: '',
            unit: 'kg',
            is_active: true,
        });
    };

    const handleSave = async () => {
        try {
            const data = {
                name: formData.name,
                price: parseFloat(formData.price),
                unit: formData.unit,
                is_active: formData.is_active,
            };

            if (editingService) {
                await adminAPI.updateService(editingService.id, data);
            } else {
                await adminAPI.createService(data);
            }

            setEditingService(null);
            setIsCreating(false);
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Gagal menyimpan layanan.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus layanan ini?')) return;

        try {
            await adminAPI.deleteService(id);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Gagal menghapus layanan.');
        }
    };

    const handleCancel = () => {
        setEditingService(null);
        setIsCreating(false);
    };

    if (loading) {
        return <AdminLayout><div className="loading">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="services-content">
                <div className="dashboard-header-simple">
                    <h1>Manajemen Layanan</h1>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        + Tambah Layanan
                    </button>
                </div>

                <div className="services-grid">
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            className="service-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="service-header">
                                <h3>{service.name}</h3>
                                <span className={`status-badge ${service.is_active ? 'active' : 'inactive'}`}>
                                    {service.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <div className="service-price">
                                Rp {Math.floor(service.price).toLocaleString('id-ID')} / {service.unit}
                            </div>
                            <div className="service-actions">
                                <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(service)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(service.id)}>
                                    Hapus
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Belum Ada Layanan</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Tambahkan layanan laundry pertama Anda agar pelanggan bisa melihat daftar harga.
                        </p>
                        <button className="btn btn-primary" onClick={handleCreate}>
                            + Tambah Layanan Pertama
                        </button>
                    </div>
                )}

                {(editingService || isCreating) && (
                    <div className="modal-overlay" onClick={handleCancel}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
                                <button className="modal-close" onClick={handleCancel}>×</button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nama Layanan</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Contoh: Cuci Kiloan"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="7000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Satuan</label>
                                    <select
                                        className="input"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="pcs">Pieces (pcs)</option>
                                        <option value="item">Item</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <span>Aktifkan layanan ini</span>
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCancel}>
                                    Batal
                                </button>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
