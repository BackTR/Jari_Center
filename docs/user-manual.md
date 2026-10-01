# Jari Center - User Manual

## 📖 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Login](#login)
3. [Super Admin Dashboard](#super-admin-dashboard)
4. [Petugas Registrasi Dashboard](#petugas-registrasi-dashboard)
5. [Manajemen Pasien](#manajemen-pasien)
6. [Manajemen Kunjungan](#manajemen-kunjungan)
7. [Manajemen Antrean](#manajemen-antrean)
8. [Fingerprint Simulation](#fingerprint-simulation)
9. [Troubleshooting](#troubleshooting)

---

## Pendahuluan

Jari Center adalah platform Digital Health Identity & Interoperability yang memungkinkan pasien memiliki satu identitas kesehatan digital (Jari ID) yang dapat digunakan di berbagai fasilitas kesehatan.

### Role yang Tersedia

| Role | Deskripsi |
|------|-----------|
| `super_admin` | Mengelola sistem, faskes, dan user |
| `petugas_registrasi` | Mendaftarkan pasien dan kunjungan |
| `perawat` | Melihat riwayat pasien |
| `dokter` | Melihat rekam medis dan menulis resep |
| `kasir` | Proses pembayaran |
| `petugas_farmasi` | Proses resep dan dispensing obat |

---

## Login

### Cara Login

1. Buka halaman login
2. Masukkan email dan password
3. Klik tombol "Masuk"
4. Sistem akan mengarahkan ke dashboard sesuai role

### Contoh Akun

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@jaricenter.test | admin123 |
| Petugas Registrasi | petugas@jaricenter.test | petugas123 |

---

## Super Admin Dashboard

### Menu yang Tersedia

| Menu | Deskripsi |
|------|-----------|
| Dashboard | Statistik global sistem |
| Manajemen Faskes | CRUD faskes |
| Manajemen User | CRUD user |
| Log Aktivitas | Log aktivitas sistem |

### Fitur Dashboard

#### 1. Statistik Global
- Total pasien terdaftar
- Total kunjungan hari ini
- Total faskes aktif
- Total user aktif
- Grafik kunjungan 7 hari terakhir
- Grafik pasien baru 7 hari terakhir

#### 2. Manajemen Faskes
- Lihat daftar semua faskes
- Tambah faskes baru
- Edit faskes
- Nonaktifkan faskes

#### 3. Manajemen User
- Lihat daftar semua user
- Tambah user baru
- Edit user
- Reset password user
- Nonaktifkan user

#### 4. Log Aktivitas
- Lihat log aktivitas sistem
- Filter berdasarkan tanggal
- Export log

---

## Petugas Registrasi Dashboard

### Menu yang Tersedia

| Menu | Deskripsi |
|------|-----------|
| Beranda | Statistik dan quick actions |
| Cari Pasien | Mencari pasien berdasarkan Jari ID, NIK, atau nama |
| Daftarkan Pasien | Mendaftarkan pasien baru |
| Daftarkan Kunjungan | Mendaftarkan kunjungan baru |
| Nomor Antrian | Melihat dan mengelola antrean |
| Kunjungan | Melihat daftar kunjungan |

### Fitur Dashboard

#### 1. Statistik Hari Ini
- Pasien baru hari ini
- Kunjungan hari ini
- Antrean menunggu
- Kunjungan selesai

#### 2. Quick Actions
- Cari Pasien
- Daftarkan Pasien
- Daftarkan Kunjungan
- Nomor Antrian

#### 3. Antrean Saat Ini
- Daftar antrean real-time
- Status antrean per poliklinik
- Waktu dipanggil

#### 4. Kunjungan Terbaru
- Daftar kunjungan terbaru
- Status kunjungan
- Aksi detail

---

## Manajemen Pasien

### Mencari Pasien

1. Buka menu "Cari Pasien"
2. Pilih tipe pencarian (Jari ID, NIK, atau Nama)
3. Masukkan kata kunci
4. Klik tombol "Cari"
5. Sistem akan menampilkan hasil pencarian

### Mendaftarkan Pasien Baru

1. Buka menu "Daftarkan Pasien"
2. Isi data identitas pasien:
   - Nama lengkap (wajib)
   - NIK (opsional)
   - Tanggal lahir (wajib)
   - Jenis kelamin (wajib)
   - Alamat (opsional)
   - Nomor telepon (opsional)
3. Daftarkan sidik jari (simulasi)
4. Isi data penjamin (opsional)
5. Klik tombol "Simpan Pasien"
6. Sistem akan menampilkan Jari ID pasien

### Data Penjamin

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Penjamin | Tidak | BPJS / Mandiri / lainnya |
| Nomor Penjamin | Tidak | Nomor polis atau nomor BPJS |

---

## Manajemen Kunjungan

### Mendaftarkan Kunjungan

1. Buka menu "Daftarkan Kunjungan"
2. Cari pasien (langkah 1)
3. Pilih pasien
4. Isi detail kunjungan:
   - Metode identifikasi (wajib)
   - Poliklinik (opsional)
   - Metode pembayaran (wajib)
   - Nomor BPJS (wajib jika BPJS)
   - Nomor surat rujukan (opsional)
   - Catatan (opsional)
5. Klik tombol "Daftarkan Kunjungan"
6. Sistem akan membuat nomor antrean

### Status Kunjungan

| Status | Deskripsi |
|--------|-----------|
| `pending_verification` | Menunggu verifikasi petugas |
| `verified` | Data pasien terverifikasi |
| `registered` | Terdaftar di poliklinik |
| `in_service` | Sedang dilayani |
| `completed` | Pelayanan selesai |
| `cancelled` | Kunjungan dibatalkan |

### Alur Status

```
pending_verification → verified → registered → in_service → completed
                    ↘ cancelled (boleh dari tahap manapun sebelum completed)
```

---

## Manajemen Antrean

### Melihat Antrean

1. Buka menu "Nomor Antrian"
2. Sistem akan menampilkan daftar antrean hari ini
3. Antrean diurutkan berdasarkan nomor antrean

### Status Antrean

| Status | Deskripsi |
|--------|-----------|
| `waiting` | Menunggu dipanggil |
| `called` | Sudah dipanggil |
| `in_service` | Sedang dilayani |
| `done` | Selesai |
| `skipped` | Dilewati |

---

## Fingerprint Simulation

### Mendaftarkan Sidik Jari

1. Buka halaman "Daftarkan Pasien"
2. Klik tombol "Daftarkan Sidik Jari"
3. Tunggu proses scanning selesai
4. Sistem akan menampilkan pesan sukses

### Mencocokkan Sidik Jari

1. Buka halaman "Cari Pasien"
2. Pilih tab "Sidik Jari"
3. Klik tombol "Scan Sidik Jari"
4. Sistem akan mencari pasien yang cocok

---

## Troubleshooting

### Tidak Bisa Login

**Penyebab:**
- Email atau password salah
- Akun nonaktif

**Solusi:**
- Pastikan email dan password benar
- Hubungi super admin untuk mengaktifkan akun

### Tidak Bisa Akses Dashboard

**Penyebab:**
- Token expired
- Role tidak memiliki akses

**Solusi:**
- Login ulang
- Hubungi super admin untuk memeriksa role

### Data Tidak Muncul

**Penyebab:**
- Belum ada data
- Filter tidak sesuai

**Solusi:**
- Cek filter yang digunakan
- Tambahkan data baru

### Error 500

**Penyebab:**
- Server error
- Bug pada sistem

**Solusi:**
- Refresh halaman
- Hubungi tim technical support

---

## 📞 Kontak

Untuk bantuan lebih lanjut, hubungi:
- Email: support@jaricenter.test
- Phone: 021-1234567

---

## 📝 Changelog

### v1.0.0 (2026-09-30)
- Initial release
- Super Admin Dashboard
- Petugas Registrasi Dashboard
- Patient Registration
- Visit Registration
- Queue Management
- Fingerprint Simulation
