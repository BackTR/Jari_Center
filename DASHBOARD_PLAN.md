# Jari Center - Dashboard (selesai)

Kedua dashboard sudah selesai. Dokumen ini cuma catatan status — bukan rencana
kerja lagi. Detail endpoint ada di `backend/docs/03-api-documentation.md`.

## Status

| Role | Halaman | Status |
|------|---------|--------|
| `super_admin` | `pages/SuperAdmin/SuperAdminDashboard.jsx` | Selesai |
| `petugas_registrasi` | `pages/Dashboard/Dashboard.jsx` | Selesai |
| `facility_admin`, `dokter` | Sama dengan petugas registrasi | Selesai (dashboard sama) |

Role redirect ada di `App.jsx` (`RoleBasedDashboard`).

## Super Admin

Sudah ada: 4 kartu statistik, grafik kunjungan & pasien baru 7 hari, tabel
faskes dengan tambah/edit/nonaktifkan, tabel user dengan tambah/edit/reset
password.

Endpoint: `/api/admin/dashboard`, `/api/admin/facilities` (GET/POST/PUT),
`/api/admin/users` (GET/POST/PUT), `/api/admin/users/{id}/reset-password`.
Semua dibungkus middleware `role:super_admin`.

Tidak ada log aktivitas — butuh tabel `activities` yang belum ada. Endpoint
`/api/admin/activities` sengaja dihapus.

## Petugas Registrasi

Sudah ada: statistik hari ini, quick actions, antrean berjalan, kunjungan
terbaru.

Endpoint: `/api/facilities/{id}/dashboard`, `/api/facilities/{id}/queues`,
`/api/visits?facility_id={id}`.

Tidak ada notifikasi real-time. Antrean di-refresh manual lewat tombol Refresh;
tidak ada polling atau websocket.

## Komponen

- `components/common/StatCard.jsx`
- `components/common/DataTable.jsx`
- `components/Layout/Layout.jsx` — sidebar menurut role

Form faskes dan user tidak dipisah jadi komponen sendiri; keduanya modal
inline di `SuperAdminDashboard.jsx` karena hanya dipakai di satu tempat.

## Kalau mau lanjut

- Log aktivitas: butuh tabel `activities` + endpoint.
- Notifikasi real-time: butuh polling atau websocket.
- Role `perawat` / `kasir` / `petugas_farmasi`: role-nya belum ada di enum DB.