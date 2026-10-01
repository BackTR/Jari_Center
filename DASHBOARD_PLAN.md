# Jari Center - Dashboard Implementation Plan

## 🎯 Focus: 2 Dashboard (MVP)

| Role | Dashboard | Status |
|------|-----------|--------|
| `super_admin` | Super Admin Dashboard | 🔴 To Do |
| `petugas_registrasi` | Petugas Registrasi Dashboard | 🔴 To Do |

---

## 📋 Next Plan (Post-MVP)

Dashboard untuk role berikut akan dibuat setelah MVP selesai:
- `perawat` - Perawat Dashboard
- `dokter` - Dokter Dashboard
- `kasir` - Kasir Dashboard
- `petugas_farmasi` - Petugas Farmasi Dashboard

---

## 1. Super Admin Dashboard

### Tujuan
Monitoring semua faskes dan keseluruhan sistem

### Fitur

#### A. Statistik Global
- [ ] Total pasien terdaftar
- [ ] Total kunjungan hari ini
- [ ] Total faskes aktif
- [ ] Total user aktif
- [ ] Grafik kunjungan 7 hari terakhir
- [ ] Grafik pasien baru 7 hari terakhir

#### B. Manajemen Faskes
- [ ] Daftar semua faskes
- [ ] Status faskes (aktif/nonaktif)
- [ ] Tambah faskes baru
- [ ] Edit faskes
- [ ] Nonaktifkan faskes

#### C. Manajemen User
- [ ] Daftar semua user
- [ ] Tambah user baru
- [ ] Edit user
- [ ] Nonaktifkan user
- [ ] Reset password user

#### D. Monitoring
- [ ] Kunjungan real-time semua faskes
- [ ] Log aktivitas sistem
- [ ] Notifikasi sistem

### Endpoint yang Dibutuhkan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/dashboard` | Statistik global |
| GET | `/api/admin/facilities` | Daftar semua faskes |
| POST | `/api/admin/facilities` | Tambah faskes |
| PUT | `/api/admin/facilities/{id}` | Edit faskes |
| GET | `/api/admin/users` | Daftar semua user |
| POST | `/api/admin/users` | Tambah user |
| PUT | `/api/admin/users/{id}` | Edit user |
| PATCH | `/api/admin/users/{id}/reset-password` | Reset password |
| GET | `/api/admin/activities` | Log aktivitas |

### UI Layout
```
┌─────────────────────────────────────────────────────────┐
│  Super Admin Dashboard                    [User] [Logout]│
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Dashboard       │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│          │  │ Pasien  │ │Kunjungan│ │ Faskes  │        │
│ Faskes   │  │  1,234  │ │   567   │ │   12    │        │
│          │  └─────────┘ └─────────┘ └─────────┘        │
│ Users    │                                              │
│          │  ┌─────────────────────────────────────┐    │
│ Monitoring│  │ Grafik Kunjungan 7 Hari Terakhir    │    │
│          │  └─────────────────────────────────────┘    │
│          │                                              │
│          │  ┌─────────────────────────────────────┐    │
│          │  │ Daftar Faskes                        │    │
│          │  └─────────────────────────────────────┘    │
│          │                                              │
│          │  ┌─────────────────────────────────────┐    │
│          │  │ Daftar User                         │    │
│          │  └─────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────┘
```

---

## 2. Petugas Registrasi Dashboard

### Tujuan
Pendaftaran pasien dan kunjungan

### Fitur

#### A. Statistik Hari Ini
- [ ] Pasien baru hari ini
- [ ] Kunjungan hari ini
- [ ] Antrean menunggu
- [ ] Kunjungan selesai

#### B. Quick Actions
- [ ] Cari Pasien
- [ ] Daftarkan Pasien
- [ ] Daftarkan Kunjungan
- [ ] Nomor Antrian

#### C. Daftar Antrean Real-time
- [ ] Nomor antrean
- [ ] Nama pasien
- [ ] Poliklinik
- [ ] Status antrean
- [ ] Waktu dipanggil

#### D. Daftar Kunjungan Terbaru
- [ ] ID kunjungan
- [ ] Nama pasien
- [ ] Status kunjungan
- [ ] Waktu dibuat
- [ ] Aksi (Detail)

#### E. Notifikasi
- [ ] Pasien baru terdaftar
- [ ] Kunjungan baru
- [ ] Antrean dipanggil

### Endpoint yang Dibutuhkan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/facilities/{id}/dashboard` | Statistik faskes |
| GET | `/api/facilities/{id}/queues` | Daftar antrean |
| GET | `/api/visits?facility_id={id}` | Daftar kunjungan |

### UI Layout
```
┌─────────────────────────────────────────────────────────┐
│  Petugas Registrasi Dashboard          [User] [Logout]  │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Dashboard       │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│          │  │ Pasien  │ │Kunjungan│ │Antrean  │        │
│ Cari     │  │   12    │ │   45    │ │   8     │        │
│ Pasien   │  └─────────┘ └─────────┘ └─────────┘        │
│          │                                              │
│ Daftar   │  ┌─────────────────────────────────────┐    │
│ Pasien   │  │ Quick Actions                        │    │
│          │  │ [Cari] [Daftar Pasien] [Kunjungan]  │    │
│ Kunjungan│  └─────────────────────────────────────┘    │
│          │                                              │
│ Antrian  │  ┌─────────────────────────────────────┐    │
│          │  │ Antrean Saat Ini                    │    │
│          │  │ P-001 - Siti Aminah - Poli Dalam    │    │
│          │  └─────────────────────────────────────┘    │
│          │                                              │
│          │  ┌─────────────────────────────────────┐    │
│          │  │ Daftar Kunjungan Terbaru            │    │
│          │  └─────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────┘
```

---

## 🏗️ Implementation Plan

### Phase 1: Super Admin Dashboard (1-2 hari)

#### Backend
1. Buat `AdminController`
   - `dashboard()` - Statistik global
   - `facilities()` - Daftar faskes
   - `storeFacility()` - Tambah faskes
   - `updateFacility()` - Edit faskes
   - `users()` - Daftar user
   - `storeUser()` - Tambah user
   - `updateUser()` - Edit user
   - `resetPassword()` - Reset password

2. Buat `FacilityController` (admin)
   - `index()` - Daftar faskes
   - `store()` - Tambah faskes
   - `update()` - Edit faskes
   - `destroy()` - Hapus faskes

3. Buat `UserController` (admin)
   - `index()` - Daftar user
   - `store()` - Tambah user
   - `update()` - Edit user
   - `destroy()` - Hapus user

4. Update `routes/api.php`
   - Tambah route group `/api/admin`
   - Tambah middleware `role:super_admin`

#### Frontend
5. Buat halaman `SuperAdminDashboard.jsx`
6. Buat komponen `StatCard.jsx`
7. Buat komponen `DataTable.jsx`
8. Update `App.jsx` untuk routing role-based

### Phase 2: Petugas Registrasi Dashboard (1 hari)

#### Backend
9. Update `DashboardController@show` untuk role-specific data
10. Update `DashboardController@queues` untuk real-time data

#### Frontend
11. Update `Dashboard.jsx` untuk role-based view
12. Tambah quick actions
13. Tambah daftar antrean real-time
14. Tambah notifikasi

---

## 📝 Database Schema

### Tabel yang Sudah Ada
- `users` - sudah ada
- `facilities` - sudah ada
- `patients` - sudah ada
- `visits` - sudah ada
- `queues` - sudah ada

### Tabel Baru yang Diperlukan
- `activities` - Log aktivitas (untuk super admin)

```sql
CREATE TABLE activities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    action VARCHAR(255),
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🎨 Komponen UI yang Dibutuhkan

### Super Admin
- `StatCard` - Kartu statistik
- `DataTable` - Tabel data dengan pagination
- `FacilityForm` - Form tambah/edit faskes
- `UserForm` - Form tambah/edit user
- `ActivityLog` - Log aktivitas

### Petugas Registrasi
- `StatCard` - Kartu statistik
- `QuickActionCard` - Karti aksi cepat
- `QueueList` - Daftar antrean real-time
- `VisitList` - Daftar kunjungan terbaru
- `NotificationBell` - Lonceng notifikasi

---

## ✅ Acceptance Criteria

### Super Admin Dashboard
- [ ] Statistik global ditampilkan dengan benar
- [ ] Daftar faskes ditampilkan dengan benar
- [ ] Daftar user ditampilkan dengan benar
- [ ] Tambah/edit faskes berfungsi
- [ ] Tambah/edit user berfungsi
- [ ] Reset password berfungsi
- [ ] Log aktivitas ditampilkan

### Petugas Registrasi Dashboard
- [ ] Statistik hari ini ditampilkan dengan benar
- [ ] Quick actions berfungsi
- [ ] Daftar antrean real-time ditampilkan
- [ ] Daftar kunjungan terbaru ditampilkan
- [ ] Notifikasi berfungsi

---

## 🚀 Next Steps

1. **Review plan ini** - Pastikan semua fitur tercakup
2. **Mulai implementasi** - Mulai dari Super Admin Dashboard
3. **Test** - Test setiap fitur dengan role yang berbeda
4. **Deploy** - Deploy ke production

---

## 📝 Catatan

- Gunakan Laravel Policy untuk authorization
- Gunakan Laravel API Resources untuk response format yang konsisten
- Gunakan Laravel Eloquent untuk database queries
- Gunakan React Context untuk state management
- Gunakan Axios untuk API calls
