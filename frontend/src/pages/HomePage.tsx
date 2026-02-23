import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import AdUnit from '../components/AdUnit';
import './HomePage.css';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: 'Bagaimana cara memesan layanan laundry di LaundryKu?',
        answer: 'Anda cukup mengunjungi halaman toko laundry pilihan Anda, isi formulir pemesanan dengan nama lengkap, alamat, dan nomor WhatsApp. Setelah pesanan dibuat, Anda akan mendapatkan kode pelacakan unik untuk memantau status cucian Anda.',
    },
    {
        question: 'Berapa lama waktu pengerjaan laundry?',
        answer: 'Waktu pengerjaan bervariasi tergantung jenis layanan yang dipilih. Untuk layanan reguler biasanya membutuhkan 2-3 hari kerja. Beberapa penyedia juga menawarkan layanan express dengan waktu lebih cepat. Hubungi penyedia laundry untuk informasi lebih detail.',
    },
    {
        question: 'Apakah tersedia layanan antar jemput (pickup & delivery)?',
        answer: 'Ya! Sebagian besar penyedia laundry di LaundryKu menawarkan layanan antar jemput gratis di area tertentu. Saat membuat pesanan, pilih opsi "Pickup (Dijemput)" untuk meminta penjemputan cucian Anda langsung dari rumah.',
    },
    {
        question: 'Bagaimana cara melacak status cucian saya?',
        answer: 'Setelah membuat pesanan, Anda akan menerima kode pelacakan dengan format DDMMYY-XXX. Masukkan kode tersebut di kolom "Lacak Pesanan" pada halaman utama untuk melihat status terkini cucian Anda secara real-time.',
    },
    {
        question: 'Apakah saya akan mendapat notifikasi ketika cucian selesai?',
        answer: 'Ya, jika penyedia laundry telah mengaktifkan fitur notifikasi WhatsApp, Anda akan menerima pesan otomatis di WhatsApp ketika cucian Anda sudah selesai dan siap diambil atau diantar.',
    },
    {
        question: 'Apa yang harus dilakukan jika ada masalah dengan pesanan?',
        answer: 'Jika terdapat masalah dengan pesanan Anda, segera hubungi penyedia laundry melalui nomor WhatsApp yang tersedia. Laporkan keluhan dalam waktu 24 jam setelah cucian diterima dengan menyertakan bukti foto jika diperlukan.',
    },
];

export default function HomePage() {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const [services, setServices] = useState<any[]>([]);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [defaultAdmin, setDefaultAdmin] = useState<any>(null);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    useEffect(() => {
        fetchShopData();
    }, []);

    const fetchShopData = async () => {
        try {
            const adminData = localStorage.getItem('admin_data');
            let adminUsername = 'admin';

            if (adminData) {
                try {
                    const parsed = JSON.parse(adminData);
                    if (parsed.username) {
                        adminUsername = parsed.username;
                    }
                } catch { }
            }

            const res = await publicAPI.getShopByUsername(adminUsername);
            const shopData = res.data.data;
            setDefaultAdmin(shopData);
            setSettings(shopData.settings || {});

            const servicesRes = await publicAPI.getShopServices(shopData.id);
            setServices(servicesRes.data.data || []);
        } catch (error) {
            console.error('Error fetching shop info:', error);
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
            {/* Hero Section */}
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
                            Lacak status cucian Anda secara real-time melalui platform digital kami.
                            Nikmati kemudahan pesan, lacak, dan terima cucian bersih langsung dari rumah Anda.
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
                            <p>Deterjen berkualitas tinggi dan pewangi pilihan untuk hasil cucian yang sempurna</p>
                        </div>

                        <div className="glass-card feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Antar Jemput</h3>
                            <p>Gratis layanan pickup dan delivery ke alamat Anda di area yang tersedia</p>
                        </div>

                        <div className="glass-card feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Pelacakan Real-time</h3>
                            <p>Pantau status cucian kapan saja dan dapatkan notifikasi otomatis via WhatsApp</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Ad Slot */}
            <div className="container">
                <AdUnit slot="1078591290" format="auto" responsive="true" style={{ margin: '40px 0' }} />
            </div>

            {/* How It Works Section */}
            <div className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title text-center">Cara Kerja LaundryKu</h2>
                    <p className="section-description text-center">
                        Proses pemesanan laundry yang mudah dan cepat hanya dalam 4 langkah sederhana.
                        Tidak perlu antri, tidak perlu ribet — cukup pesan dari rumah!
                    </p>

                    <div className="steps-grid">
                        <motion.div className="step-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                            <div className="step-number">1</div>
                            <div className="step-icon">📝</div>
                            <h3>Buat Pesanan</h3>
                            <p>Kunjungi halaman toko dan isi formulir pemesanan. Masukkan nama lengkap, alamat pengambilan, nomor WhatsApp, serta pilih jenis layanan yang Anda inginkan (kiloan atau satuan).</p>
                        </motion.div>

                        <motion.div className="step-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
                            <div className="step-number">2</div>
                            <div className="step-icon">🚚</div>
                            <h3>Penjemputan</h3>
                            <p>Tim kami akan menjemput cucian Anda langsung dari alamat yang dicantumkan. Untuk layanan antar sendiri, Anda bisa membawa cucian langsung ke outlet laundry terdekat.</p>
                        </motion.div>

                        <motion.div className="step-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
                            <div className="step-number">3</div>
                            <div className="step-icon">👕</div>
                            <h3>Proses Pencucian</h3>
                            <p>Cucian Anda diproses menggunakan deterjen premium dan teknik pencucian profesional. Pantau status pengerjaan secara real-time melalui kode pelacakan yang diberikan.</p>
                        </motion.div>

                        <motion.div className="step-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }}>
                            <div className="step-number">4</div>
                            <div className="step-icon">✅</div>
                            <h3>Selesai &amp; Diantar</h3>
                            <p>Setelah cucian selesai, Anda akan menerima notifikasi WhatsApp otomatis. Cucian bersih dan wangi diantarkan kembali ke alamat Anda atau siap diambil di outlet.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Services Pricing Section */}
            {services.length > 0 && (
                <div className="pricing-section" id="pricing-section">
                    <div className="container">
                        <h2 className="section-title text-center">Daftar Harga Layanan</h2>
                        <p className="section-description text-center">
                            Harga transparan tanpa biaya tersembunyi. Pilih layanan yang sesuai dengan kebutuhan Anda.
                        </p>
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

            {/* Why Choose Us - Expanded */}
            <div className="features-section">
                <div className="container">
                    <h2 className="section-title text-center">Kenapa Pilih Kami?</h2>
                    <p className="section-description text-center">
                        Kami berkomitmen memberikan layanan laundry terbaik dengan teknologi modern untuk kenyamanan Anda.
                    </p>

                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-number">01</div>
                            <h4>Cepat &amp; Tepat Waktu</h4>
                            <p>Kami menghargai waktu Anda. Layanan express tersedia untuk kebutuhan mendesak dengan estimasi penyelesaian mulai dari 6 jam. Cucian reguler selesai dalam 2-3 hari kerja dengan kualitas terjamin.</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">02</div>
                            <h4>Harga Transparan</h4>
                            <p>Semua harga tertera jelas di halaman daftar harga. Tidak ada biaya tersembunyi atau tambahan tak terduga. Anda tahu persis berapa yang harus dibayar sebelum menggunakan layanan kami.</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">03</div>
                            <h4>Aman &amp; Terpercaya</h4>
                            <p>Cucian Anda ditangani oleh tenaga profesional dengan pengalaman bertahun-tahun. Setiap item dicuci dan disetrika dengan perhatian khusus untuk menjaga kualitas dan keawetan pakaian Anda.</p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-number">04</div>
                            <h4>Teknologi Modern</h4>
                            <p>Sistem pelacakan real-time dan notifikasi otomatis via WhatsApp memastikan Anda selalu mendapat informasi terbaru tentang status cucian. Pesan, lacak, dan terima — semua dari genggaman tangan.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Slot: Before FAQ */}
            <div className="container">
                <AdUnit slot="1078591290" format="auto" responsive="true" style={{ margin: '20px 0' }} />
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <div className="container">
                    <h2 className="section-title text-center">Pertanyaan yang Sering Diajukan</h2>
                    <p className="section-description text-center">
                        Temukan jawaban atas pertanyaan umum seputar layanan laundry kami.
                        Masih ada pertanyaan? Jangan ragu untuk menghubungi kami.
                    </p>

                    <div className="faq-list">
                        {faqData.map((faq, index) => (
                            <motion.div
                                key={index}
                                className={`faq-item ${openFAQ === index ? 'open' : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className="faq-toggle">{openFAQ === index ? '−' : '+'}</span>
                                </button>
                                {openFAQ === index && (
                                    <motion.div
                                        className="faq-answer"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p>{faq.answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span>🧺</span>
                                <span className="footer-logo-text">LaundryKu</span>
                            </div>
                            <p className="footer-tagline">
                                Platform manajemen laundry digital terpercaya di Indonesia.
                                Mempermudah pengelolaan bisnis laundry dengan teknologi modern
                                untuk memberikan pengalaman terbaik bagi pelanggan dan pemilik usaha.
                            </p>
                        </div>

                        <div className="footer-links-group">
                            <h4>Layanan</h4>
                            <ul>
                                <li><Link to={shopLink}>Pesan Laundry</Link></li>
                                <li><Link to="/">Lacak Pesanan</Link></li>
                                <li><Link to="/">Daftar Harga</Link></li>
                            </ul>
                        </div>

                        <div className="footer-links-group">
                            <h4>Informasi</h4>
                            <ul>
                                <li><Link to="/privacy">Kebijakan Privasi</Link></li>
                                <li><Link to="/terms">Syarat &amp; Ketentuan</Link></li>
                                <li><Link to="/admin/login">Login Admin</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} LaundryKu. Hak cipta dilindungi undang-undang.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
