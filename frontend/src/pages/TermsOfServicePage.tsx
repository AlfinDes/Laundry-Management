import { motion } from 'framer-motion';
import './PrivacyPolicyPage.css';

export default function TermsOfServicePage() {
    const lastUpdated = '23 Februari 2026';

    return (
        <div className="privacy-page">
            <div className="container">
                <motion.div
                    className="privacy-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1>Syarat &amp; Ketentuan</h1>
                    <p className="last-updated">Terakhir diperbarui: {lastUpdated}</p>

                    <section>
                        <h2>1. Ketentuan Umum</h2>
                        <p>
                            Dengan menggunakan layanan LaundryKu, Anda menyetujui seluruh syarat dan
                            ketentuan yang berlaku di halaman ini. LaundryKu adalah platform digital yang
                            menghubungkan pelanggan dengan penyedia layanan laundry profesional untuk
                            mempermudah proses pemesanan, pelacakan, dan pengelolaan cucian.
                        </p>
                        <p>
                            Layanan ini tersedia untuk seluruh pengguna di Indonesia yang berusia minimal
                            17 tahun atau memiliki izin dari orang tua/wali.
                        </p>
                    </section>

                    <section>
                        <h2>2. Lingkup Layanan</h2>
                        <p>LaundryKu menyediakan layanan berikut:</p>
                        <ul>
                            <li>Pemesanan layanan laundry kiloan dan satuan secara online</li>
                            <li>Penjemputan dan pengantaran cucian (pickup &amp; delivery)</li>
                            <li>Pelacakan status pesanan secara real-time melalui kode pelacakan</li>
                            <li>Notifikasi WhatsApp otomatis ketika pesanan selesai</li>
                            <li>Dashboard manajemen untuk pemilik usaha laundry</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Proses Pemesanan</h2>
                        <p>
                            Pelanggan dapat membuat pesanan melalui halaman toko penyedia laundry.
                            Setelah pesanan dibuat, pelanggan akan menerima kode pelacakan unik yang
                            dapat digunakan untuk memantau status cucian. Pesanan akan diproses sesuai
                            antrian dan estimasi waktu yang ditentukan oleh penyedia layanan.
                        </p>
                        <p>
                            Penyedia layanan berhak menolak pesanan jika terdapat kondisi yang tidak
                            memungkinkan pemrosesan, seperti bahan cucian yang tidak dapat dicuci
                            dengan metode standar.
                        </p>
                    </section>

                    <section>
                        <h2>4. Harga dan Pembayaran</h2>
                        <p>
                            Harga layanan ditentukan oleh masing-masing penyedia laundry dan tercantum
                            di halaman daftar harga. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan
                            terlebih dahulu. Pembayaran dilakukan sesuai metode yang disepakati antara
                            pelanggan dan penyedia layanan (tunai, transfer bank, atau metode lainnya).
                        </p>
                    </section>

                    <section>
                        <h2>5. Tanggung Jawab Pengguna</h2>
                        <p>Sebagai pengguna layanan, Anda bertanggung jawab untuk:</p>
                        <ul>
                            <li>Memberikan informasi yang akurat saat membuat pesanan (nama, alamat, nomor telepon)</li>
                            <li>Memastikan cucian yang diserahkan dalam kondisi yang wajar untuk diproses</li>
                            <li>Mengosongkan kantong pakaian dari barang berharga sebelum diserahkan</li>
                            <li>Melakukan pembayaran sesuai dengan harga yang telah disepakati</li>
                            <li>Mengambil cucian yang telah selesai dalam waktu yang wajar</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Tanggung Jawab Penyedia Layanan</h2>
                        <p>Penyedia layanan laundry bertanggung jawab untuk:</p>
                        <ul>
                            <li>Memproses cucian dengan standar kualitas yang baik</li>
                            <li>Menjaga keamanan dan kebersihan cucian pelanggan</li>
                            <li>Memperbarui status pesanan secara berkala melalui sistem</li>
                            <li>Menangani keluhan pelanggan dengan itikad baik</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Pembatasan Tanggung Jawab</h2>
                        <p>
                            LaundryKu sebagai platform tidak bertanggung jawab atas kerusakan, kehilangan,
                            atau perubahan warna pada cucian yang disebabkan oleh proses pencucian.
                            Klaim terkait kerusakan harus disampaikan dalam waktu 24 jam setelah
                            cucian diterima, disertai bukti foto sebelum dan sesudah pencucian.
                        </p>
                        <p>
                            Kompensasi maksimal yang diberikan tidak melebihi 10 kali lipat dari
                            biaya layanan untuk item terkait.
                        </p>
                    </section>

                    <section>
                        <h2>8. Hak Kekayaan Intelektual</h2>
                        <p>
                            Seluruh konten, desain, logo, dan fitur yang terdapat di platform LaundryKu
                            merupakan hak milik LaundryKu dan dilindungi oleh hukum hak cipta yang berlaku
                            di Indonesia. Pengguna tidak diperkenankan menyalin, memodifikasi, atau
                            mendistribusikan konten tanpa izin tertulis.
                        </p>
                    </section>

                    <section>
                        <h2>9. Penyelesaian Sengketa</h2>
                        <p>
                            Apabila terjadi sengketa antara pelanggan dan penyedia layanan, kedua
                            belah pihak sepakat untuk menyelesaikan masalah secara musyawarah terlebih
                            dahulu. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan sesuai
                            dengan hukum yang berlaku di Republik Indonesia.
                        </p>
                    </section>

                    <section>
                        <h2>10. Perubahan Syarat &amp; Ketentuan</h2>
                        <p>
                            LaundryKu berhak mengubah syarat dan ketentuan ini sewaktu-waktu.
                            Perubahan akan diinformasikan melalui website ini. Penggunaan layanan
                            secara berkelanjutan setelah perubahan dianggap sebagai persetujuan
                            terhadap syarat dan ketentuan yang diperbarui.
                        </p>
                    </section>

                    <section>
                        <h2>11. Hubungi Kami</h2>
                        <p>
                            Jika Anda memiliki pertanyaan mengenai Syarat &amp; Ketentuan ini,
                            silakan hubungi kami melalui halaman utama website kami atau melalui
                            WhatsApp yang tersedia di halaman toko masing-masing penyedia layanan.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
