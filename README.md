# Laundry Management System

Sistem manajemen laundry dengan fitur tracking order untuk customer dan dashboard admin untuk mengelola pesanan.

## 🚀 Cara Menjalankan Server

### Prerequisites
- PHP 8.2+
- PostgreSQL
- Node.js 18+
- Composer

### 1. Setup Backend (Laravel API)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
composer install

# Setup database di PostgreSQL
# Buat database: laundry_db
# Buat user: laundry_user dengan password: laundry_pass

# Jalankan migration
php artisan migrate

# Seed admin user (username: admin, password: admin123)
php artisan db:seed --class=AdminSeeder

# Jalankan server Laravel
php artisan serve
```

Server backend akan berjalan di: **http://127.0.0.1:8000**

### ⚡ Quick Start (Jalankan Semua)

Jika Anda ingin menjalankan backend dan frontend sekaligus dengan satu perintah:

```bash
# Install dependencies (jika belum)
npm run install:all

# Jalankan semua server
npm run dev
```

---

### 1. Setup Backend (Laravel API)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Server frontend akan berjalan di: **http://localhost:5173**

## 📱 Akses Aplikasi

### Customer (Public)
- **Homepage**: http://localhost:5173
- **Fitur**:
  - Request Pickup (buat pesanan baru)
  - Track Order (lacak pesanan dengan tracking ID)

### Admin
- **Login Page**: http://localhost:5173/admin/login
- **Kredensial**:
  - Username: `admin`
  - Password: `admin123`
- **Fitur**:
  - Dashboard dengan statistik
  - Manajemen pesanan
  - Pengaturan bisnis (nama laundry, WhatsApp)

## 🔧 Konfigurasi

### Backend (.env)
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laundry_db
DB_USERNAME=laundry_user
DB_PASSWORD=laundry_pass
```

### Frontend (Vite Proxy)
Frontend sudah dikonfigurasi untuk proxy API ke backend:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

## 📝 API Endpoints

### Public Endpoints
- `POST /api/orders` - Buat pesanan baru
- `GET /api/orders/{tracking_id}` - Track pesanan
- `GET /api/settings` - Get business settings

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Login admin
- `GET /api/admin/orders` - List semua pesanan
- `PUT /api/admin/orders/{id}` - Update pesanan
- `GET /api/admin/stats` - Dashboard statistics
- `PUT /api/admin/settings` - Update business settings

## 🧪 Testing

Kedua server harus berjalan bersamaan untuk testing:

1. **Terminal 1** - Backend:
   ```bash
   cd backend && php artisan serve
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd frontend && npm run dev
   ```

3. Buka browser ke http://localhost:5173

## 📦 Struktur Project

```
Laundry-management/
├── backend/          # Laravel API
│   ├── app/
│   ├── database/
│   └── routes/
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── vite.config.ts
└── tasks/           # Task management files
```

## 🎯 Status Testing

✅ Backend API berjalan dengan baik
✅ Frontend terhubung ke backend via proxy
✅ Order tracking berfungsi (tested dengan LND-9751)
✅ Admin login berfungsi
✅ Admin dashboard menampilkan data
✅ Settings management berfungsi
✅ Tidak ada error di console

## 🔐 Default Admin Account

Setelah menjalankan seeder:
- Username: `admin`
- Password: `admin123`

**⚠️ Penting**: Ganti password default ini di production!
