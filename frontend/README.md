# Jari Center — Frontend (React + Vite)

Frontend untuk sistem registrasi pasien & kunjungan Jari Center, mengikuti dokumentasi API backend (Laravel + Sanctum).

## Struktur folder

```
src/
  api/           panggilan HTTP ke backend (axios), satu file per resource
  context/       AuthContext — menyimpan token & user, login/logout
  components/    komponen re-usable (Layout, StageBadge, PatientResultCard, PrivateRoute)
  pages/         satu folder per halaman, masing-masing dengan .jsx + .css
  styles/        variables.css (design tokens) & global.css (reset + kelas util)
  utils/         helper murni: stage.js (alur tahap), date.js, errors.js
```

## Menjalankan

```bash
npm install
cp .env.example .env   # sesuaikan VITE_API_BASE_URL kalau backend beda alamat
npm run dev
```

Pastikan backend Laravel jalan di alamat yang sama dengan `VITE_API_BASE_URL`
(default `http://127.0.0.1:8000/api`) dan CORS-nya mengizinkan origin dev
server ini (default Vite: `http://127.0.0.1:5173`).

## Alur halaman

- **/login** — form login, menyimpan token Sanctum ke localStorage.
- **/** — beranda, quick actions + pencarian kunjungan berdasarkan ID.
- **/pasien/cari** — cari pasien via Jari ID / NIK / nama, lalu bisa langsung
  "Daftarkan Kunjungan" dari hasil pencarian.
- **/pasien/baru** — form registrasi pasien baru. `jari_id` tidak pernah
  dikirim dari sini — server yang generate.
- **/kunjungan/baru** — jika pasien belum dipilih (buka langsung dari menu),
  ada pencarian pasien inline dulu; kalau datang dari halaman lain lewat
  tombol, pasien sudah otomatis terisi. Field `bpjs_number` wajib muncul
  kalau metode pembayaran BPJS.
- **/kunjungan/:id** — detail kunjungan, histori tahap, dan tombol untuk
  memindahkan tahap (hanya menampilkan tahap tujuan yang valid dari status
  saat ini, plus opsi batalkan kalau belum selesai).

## Autentikasi & sesi habis

`src/api/axios.js` otomatis menyisipkan header `Authorization: Bearer` dan
`Accept: application/json` di setiap request. Kalau backend membalas `401`
di luar `/login`, event `jari:unauthorized` dipicu, `AuthContext` membersihkan
sesi, dan `PrivateRoute` akan mengarahkan user kembali ke `/login`.

## Belum diimplementasikan (menunggu endpoint backend)

Sesuai catatan dokumentasi API — nomor rekam medis per faskes, nomor antrean,
simulasi fingerprint, dan dashboard/statistik faskes belum punya endpoint,
jadi belum ada tampilannya di frontend ini.
