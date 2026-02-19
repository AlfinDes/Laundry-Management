import { motion } from 'framer-motion';
import './PrivacyPolicyPage.css';

export default function PrivacyPolicyPage() {
    const lastUpdated = '19 Februari 2026';

    return (
        <div className="privacy-page">
            <div className="container">
                <motion.div
                    className="privacy-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1>Kebijakan Privasi</h1>
                    <p className="last-updated">Terakhir diperbarui: {lastUpdated}</p>

                    <section>
                        <h2>1. Informasi yang Kami Kumpulkan</h2>
                        <p>
                            Saat Anda menggunakan layanan LaundryKu, kami mengumpulkan informasi
                            yang Anda berikan secara langsung, seperti:
                        </p>
                        <ul>
                            <li>Nama lengkap</li>
                            <li>Alamat pengambilan/pengiriman cucian</li>
                            <li>Nomor telepon</li>
                            <li>Informasi pesanan (jenis layanan, berat, status)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Cara Kami Menggunakan Informasi</h2>
                        <p>Informasi yang dikumpulkan digunakan untuk:</p>
                        <ul>
                            <li>Memproses dan melacak pesanan laundry Anda</li>
                            <li>Menghubungi Anda terkait status pesanan</li>
                            <li>Meningkatkan kualitas layanan kami</li>
                            <li>Menampilkan iklan yang relevan melalui Google AdSense</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Google AdSense & Cookie</h2>
                        <p>
                            Website ini menggunakan Google AdSense untuk menampilkan iklan. Google
                            AdSense menggunakan cookie untuk menampilkan iklan yang relevan berdasarkan
                            kunjungan Anda ke website ini dan website lain. Anda dapat menonaktifkan
                            penggunaan cookie dengan mengunjungi{' '}
                            <a
                                href="https://www.google.com/settings/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Pengaturan Iklan Google
                            </a>
                            .
                        </p>
                        <p>
                            Pihak ketiga (termasuk Google) menggunakan cookie untuk menampilkan iklan
                            berdasarkan kunjungan sebelumnya Anda ke website ini. Penggunaan cookie
                            iklan oleh Google memungkinkan Google dan mitranya untuk menampilkan iklan
                            kepada Anda berdasarkan kunjungan ke website ini.
                        </p>
                    </section>

                    <section>
                        <h2>4. Keamanan Data</h2>
                        <p>
                            Kami berkomitmen untuk melindungi informasi pribadi Anda. Data pesanan
                            disimpan dengan aman dan hanya dapat diakses oleh staf laundry yang
                            berwenang menggunakan sistem autentikasi yang terenkripsi.
                        </p>
                    </section>

                    <section>
                        <h2>5. Berbagi Data dengan Pihak Ketiga</h2>
                        <p>
                            Kami tidak menjual, memperdagangkan, atau memindahkan informasi pribadi
                            Anda kepada pihak luar, kecuali:
                        </p>
                        <ul>
                            <li>Diperlukan untuk memproses pesanan Anda</li>
                            <li>Diwajibkan oleh hukum yang berlaku</li>
                            <li>
                                Layanan iklan pihak ketiga (Google AdSense) sesuai kebijakan privasi
                                mereka
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Hak Anda</h2>
                        <p>Anda berhak untuk:</p>
                        <ul>
                            <li>Mengakses data pribadi yang kami simpan tentang Anda</li>
                            <li>Meminta penghapusan data pesanan Anda</li>
                            <li>Menolak penggunaan data untuk tujuan pemasaran</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Perubahan Kebijakan</h2>
                        <p>
                            Kebijakan Privasi ini dapat diperbarui sewaktu-waktu. Perubahan akan
                            diberitahukan melalui website ini. Penggunaan layanan secara berkelanjutan
                            setelah perubahan berarti Anda menyetujui kebijakan yang diperbarui.
                        </p>
                    </section>

                    <section>
                        <h2>8. Hubungi Kami</h2>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan
                            hubungi kami melalui halaman utama website kami.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
