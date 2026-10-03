# Jari Center — Frontend (React + Vite)

Frontend untuk sistem registrasi pasien & kunjungan Jari Center, mengikuti dokumentasi API backend (Laravel + Sanctum).

## Struktur folder

```
src/
  api/           panggilan HTTP ke backend (axios), satu file per resource
  context/       AuthContext — menyimpan token & user, login/logout
  components/    komponen re-usable (Layout, DataTable, StageBadge, PrivateRoute)
                 + icons.jsx — satu-satunya tempat definisi icon
  pages/         satu folder per halaman, masing-masing dengan .jsx + .css
  styles/        variables.css (design tokens) & global.css (reset + kelas util)
  utils/         helper murni: stage.js (alur tahap), date.js, errors.js
```

Icon tidak perlu ditambahkan per halaman. Tambah path-nya di
`src/components/icons.jsx`, lalu pakai lewat named export
(`<QueueIcon size={18} />`) atau `<Icon name="queue" />`. Semua icon
24×24 dengan `stroke="currentColor"`, jadi warnanya ikut `color` induknya dan
CSS tetap bisa mengatur ukuran lewat `svg { width; height }`.

## Menjalankan

```bash
npm install
cp .env.example .env   # sesuaikan VITE_API_BASE_URL kalau backend beda alamat
npm run dev
```

Backend harus jalan di alamat `VITE_API_BASE_URL` (default `http://127.0.0.1:8000/api`).
Backend hanya mengizinkan origin yang terdaftar di env `FRONTEND_URL` miliknya
(default `http://localhost:5173`) — kalau port Vite beda, samakan dua-duanya.

## Alur halaman

- **/login** — form login, menyimpan token Sanctum ke localStorage. Token berlaku 12 jam.
- **/** — beranda sesuai role: dashboard petugas atau super admin.
- **/pasien/cari** — cari pasien via Jari ID / NIK / nama, atau lewat tab Sidik Jari.
- **/pasien/baru** — form registrasi pasien baru. `jari_id` tidak pernah
  dikirim dari sini — server yang generate.
- **/kunjungan** — daftar kunjungan di faskes, dengan filter tanggal.
- **/kunjungan/baru** — jika pasien belum dipilih (buka langsung dari menu),
  ada pencarian pasien inline dulu; kalau datang dari halaman lain lewat
  tombol, pasien sudah otomatis terisi. Field `bpjs_number` wajib muncul
  kalau metode pembayaran BPJS.
- **/kunjungan/:id** — detail kunjungan, histori tahap, dan tombol untuk
  memindahkan tahap (hanya menampilkan tahap tujuan yang valid dari status
  saat ini, plus opsi batalkan kalau belum selesai).
- **/antrean** — antrean hari ini. API mengembalikan `visit_status`, bukan
  `status`, karena tahap antrean adalah tahap kunjungan. Tidak ada tombol
  panggil terpisah; panggil/layani dilakukan dari halaman detail kunjungan.

Dashboard super admin menyertakan pengelolaan faskes dan user (tambah, edit,
reset password) langsung di halaman dashboard.

## Autentikasi & sesi habis

`src/api/axios.js` otomatis menyisipkan header `Authorization: Bearer` dan
`Accept: application/json` di setiap request. Kalau backend membalas `401`
di luar `/login`, event `jari:unauthorized` dipicu, `AuthContext` membersihkan
sesi, dan `PrivateRoute` akan mengarahkan user kembali ke `/login`.

## Catatan

Sidik jari masih simulasi — template dummy, bukan scanner sungguhan.
Butuh backend + `php artisan db:seed` untuk melihat data demo.