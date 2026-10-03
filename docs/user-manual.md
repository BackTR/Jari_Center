# Jari Center - User Manual

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Login](#login)
3. [Role dan Hak Akses](#role-dan-hak-akses)
4. [Super Admin](#super-admin)
5. [Petugas Registrasi](#petugas-registrasi)
6. [Manajemen Pasien](#manajemen-pasien)
7. [Manajemen Kunjungan](#manajemen-kunjungan)
8. [Antrean](#antrean)
9. [Sidik Jari](#sidik-jari)
10. [Troubleshooting](#troubleshooting)

---

## Pendahuluan

Jari Center adalah aplikasi registrasi dan antrean fasilitas kesehatan. Setiap
pasien mendapat satu identitas digital bernama **Jari ID** yang berlaku lintas
faskes, plus satu **Nomor RM** per faskes.

Aplikasi ini terdiri dari dua bagian:

| Bagian | Lokasi | Menjalankan |
|--------|--------|-------------|
| API | `backend/` | PHP + Laravel |
| Antarmuka | `frontend/` | React + Vite |

Belum ada integrasi SATUSEHAT/BPJS, rekam medis lengkap, resep, atau mode IGD.

---

## Login

1. Buka halaman login di `frontend/`
2. Masukkan email dan password
3. Sistem mengarahkan ke dashboard sesuai role

### Akun Demo

Dibuat oleh `php artisan db:seed`. **Password semuanya `password123`.**

| Role | Email | Faskes |
|------|-------|--------|
| Super Admin | `superadmin@jaricenter.test` | — |
| Petugas Registrasi | `andi@jaricenter.test` | RS Sehat Abadi |
| Dokter | `budi.dokter@jaricenter.test` | RS Sehat Abadi |
| Admin Faskes | `admin.klinik@jaricenter.test` | Klinik Sehat Ceria |

Tidak ada pendaftaran mandiri. User hanya dibuat oleh Super Admin.

Sesi login berlaku 12 jam, lalu token otomatis kedaluwarsa.

---

## Role dan Hak Akses

Hanya ada 4 role:

| Role | Lingkup | Boleh |
|------|---------|-------|
| `super_admin` | Semua faskes | Semua fitur + kelola faskes & user |
| `facility_admin` | Satu faskes | Sama dengan petugas registrasi |
| `petugas_registrasi` | Satu faskes | Daftarkan pasien, kunjungan, kelola antrean |
| `dokter` | Satu faskes | Sama dengan petugas registrasi |

Tiga role selain `super_admin` punya hak akses API yang sama; yang membedakan
hanya cakupan faskes. **Semua hanya melihat data faskes sendiri**. Mencoba
mengakses faskes lain atau pasien yang belum pernah terdaftar di faskes itu
menghasilkan error 403.

Tidak ada role `perawat`, `kasir`, atau `petugas_farmasi` di sistem ini.

---

## Super Admin

### Dashboard

Empat kartu statistik: total pasien, kunjungan hari ini, faskes aktif, user
aktif.

### Manajemen Faskes

- Lihat daftar semua faskes, jumlah user, jumlah kunjungan
- Tambah faskes: nama, tipe (hospital/clinic/puskesmas), kode unik, alamat, telepon
- Edit faskes termasuk menonaktifkannya

### Manajemen User

- Lihat semua user beserta role dan faskesnya
- Tambah user: nama, email, password, role, faskes
- Edit user: ganti role, faskes, atau status aktif
- Reset password user

Super Admin tidak punya faskes, jadi `facility_id` kosong saat menambah user
dengan role `super_admin`.

### Log Aktivitas

Belum ada. Endpoint `/api/admin/activities` sudah dihapus karena tidak ada
tabel audit.

---

## Petugas Registrasi

Menu: Beranda, Cari Pasien, Daftarkan Pasien, Daftarkan Kunjungan, Nomor
Antrian, Kunjungan.

Beranda menampilkan statistik hari ini, antrean berjalan, dan kunjungan
terbaru.

---

## Manajemen Pasien

### Mencari Pasien

1. Buka menu "Cari Pasien"
2. Pilih tab **Cari NIK / Nama** atau **Sidik Jari**
3. Tab NIK/Nama: pilih basis pencarian (NIK / Jari ID / Nama), ketik kata kunci
4. Tab Sidik Jari: tempel template hasil scan scanner
5. Hasil hanya menampilkan pasien yang sudah terdaftar di faskes Anda

### Mendaftarkan Pasien Baru

1. Buka menu "Daftarkan Pasien"
2. Klik "Daftarkan Sidik Jari" dan tunggu proses scan
3. Isi data pasien: nama, tanggal lahir, jenis kelamin (wajib); NIK, alamat,
   telepon, penjamin (opsional)
4. Klik "Simpan Pasien"
5. Sistem menampilkan Jari ID

Sidik jari wajib diisi sebelum menyimpan. Pasien langsung mendapat Nomor RM di
faskes tempat ia didaftarkan.

### Field Pasien

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama | Ya | |
| Tanggal lahir | Ya | Harus sebelum hari ini |
| Jenis kelamin | Ya | male / female |
| NIK | Tidak | 16 digit, unik |
| Alamat | Tidak | |
| Telepon | Tidak | |
| Penjamin | Tidak | BPJS / Mandiri |
| Nomor penjamin | Tidak | |

---

## Manajemen Kunjungan

### Mendaftarkan Kunjungan

1. Menu "Daftarkan Kunjungan"
2. Pilih pasien hasil pencarian
3. Isi: metode identifikasi, poliklinik, metode pembayaran, nomor BPJS (wajib
   jika BPJS), nomor surat rujukan, catatan
4. Klik "Daftarkan Kunjungan"
5. Sistem otomatis membuat **Nomor RM** (bila belum ada) dan **nomor antrean**

### Tahap Kunjungan

| Tahap | Deskripsi |
|-------|-----------|
| `pending_verification` | Menunggu verifikasi petugas |
| `verified` | Data terverifikasi |
| `registered` | Terdaftar di poliklinik |
| `in_service` | Sedang dilayani |
| `completed` | Selesai |
| `cancelled` | Dibatalkan |

```
pending_verification → verified → registered → in_service → completed
                    ↘ cancelled (boleh dari tahap sebelum completed)
```

Tahap hanya boleh maju satu per satu. Melompat ditolak dengan 422. Setiap
perpindahan tercatat di riwayat kunjungan.

---

## Antrean

Menu "Nomor Antrian" menampilkan antrean hari ini, diurutkan per nomor.

| Status | Deskripsi |
|--------|-----------|
| `waiting` | Menunggu dipanggil |
| `called` | Sudah dipanggil |
| `in_service` | Sedang dilayani |
| `done` | Selesai |
| `skipped` | Dilewati |

Nomor antrean memakai prefiks huruf pertama kode poliklinik, contoh `P-001`
untuk Poli Penyakit Dalam, `U-001` tanpa poliklinik.

---

## Sidik Jari

**Simulasi.** Belum ada integrasi scanner sungguhan. Backend menyimpan HMAC-SHA256
dari template, bukan citra sidik jari.

### Mendaftarkan

Tombol "Daftarkan Sidik Jari" di halaman pendaftaran pasien menghasilkan template
dummy, lalu dikirim ke server setelah pasien tersimpan.

### Mencocokkan

Tab "Sidik Jari" di halaman Cari Pasien. Tempel template yang sama dengan yang
digunakan saat pendaftaran, lalu klik "Identifikasi".

Satu template hanya bisa dipakai satu pasien; enroll ulang template yang sama
ditolak dengan 409.

Kalau sidik jari milik pasien faskes lain, sistem menjawab "tidak cocok" —
identik dengan jawaban saat template memang tidak terdaftar.

---

## Troubleshooting

### Tidak bisa login

Email/password salah, akun nonaktif, atau lebih dari 5 percobaan dalam 1 menit
(rate limit).

### 403 "Anda tidak memiliki akses ke faskes ini"

Akun Anda terdaftar di faskes lain. Hubungi Super Admin.

### Pasien tidak muncul saat mencari

Petugas hanya melihat pasien yang sudah pernah terdaftar atau berkunjung di
faskes-nya. Ini melindungi data antar faskes. Daftarkan pasien lewat "Daftarkan
Pasien" dulu.

### Gagal menyimpan pasien

Sidik jari belum didaftarkan. Klik tombol scan terlebih dahulu.

### Error 422 saat ubah tahap kunjungan

Tahap hanya boleh maju satu per satu sesuai alur di atas.

### Error 409 saat daftarkan sidik jari

Template sudah dipakai pasien lain. Scan ulang untuk template baru.

---

## Kontak

- Email: support@jaricenter.test
- Telepon: 021-1234567
