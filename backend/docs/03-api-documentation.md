# API Documentation — Jari Center Backend (MVP)

Base URL (development): `http://127.0.0.1:8000/api`

## Autentikasi

Semua endpoint (kecuali `/login`) butuh Bearer Token dari Sanctum.

**Wajib** kirim header berikut di **setiap** request:

```
Accept: application/json
```

Setelah login, sertakan token di header:

```
Authorization: Bearer {token}
```

---

## 1. Auth

### `POST /login`

Login petugas, mendapatkan token.

**Request body:**
```json
{
  "email": "andi@jaricenter.test",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "user": {
    "id": 1,
    "name": "Andi Pratama",
    "email": "andi@jaricenter.test",
    "role": "petugas_registrasi",
    "facility_id": 1
  },
  "token": "1|abcdef123456..."
}
```

**Response `422`** (email/password salah, atau akun nonaktif):
```json
{
  "message": "Email atau password salah.",
  "errors": { "email": ["Email atau password salah."] }
}
```

---

### `POST /logout`
*(Perlu token)*

Mencabut token yang sedang dipakai.

**Response `200`:**
```json
{ "message": "Berhasil logout" }
```

Setelah logout, token yang sama tidak bisa dipakai lagi (akan dapat `401` di request berikutnya).

---

## 2. Patient

### `POST /patients`
*(Perlu token)*

Mendaftarkan pasien baru. `jari_id` di-generate otomatis oleh server — **jangan** dikirim dari client.

**Request body:**
```json
{
  "nik": "3175010101680001",
  "name": "Siti Aminah",
  "date_of_birth": "1968-05-12",
  "gender": "female",
  "address": "Jl. Merdeka No. 10",
  "phone": "081234567890",
  "insurance_provider": "BPJS",
  "insurance_number": "0001234567890"
}
```

Field wajib: `name`, `date_of_birth`, `gender` (`male`/`female`). Sisanya opsional.

**Response `201`:**
```json
{
  "data": {
    "id": 1,
    "jari_id": "JARI-2026-04821793",
    "nik": "3175010101680001",
    "name": "Siti Aminah",
    "date_of_birth": "1968-05-12",
    "gender": "female",
    "address": "Jl. Merdeka No. 10",
    "phone": "081234567890",
    "insurance_provider": "BPJS",
    "insurance_number": "0001234567890",
    "created_at": "2026-09-12T09:24:15+00:00"
  }
}
```

**Response `422`** (validasi gagal, mis. NIK sudah terdaftar):
```json
{
  "message": "The nik has already been taken.",
  "errors": { "nik": ["The nik has already been taken."] }
}
```

---

### `GET /patients/identify`
*(Perlu token)*

Mencari pasien berdasarkan Jari ID, NIK, atau keyword nama.

**Query params:**
| Param | Wajib | Nilai |
|---|---|---|
| `type` | ya | `jari_id`, `nik`, atau `keyword` |
| `value` | ya | nilai yang dicari (min. 2 karakter) |

**Contoh:** `GET /patients/identify?type=nik&value=3175010101680001`

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "jari_id": "JARI-2026-04821793",
      "nik": "3175010101680001",
      "name": "Siti Aminah",
      "date_of_birth": "1968-05-12",
      "gender": "female",
      "address": "Jl. Merdeka No. 10",
      "phone": "081234567890",
      "insurance_provider": "BPJS",
      "insurance_number": "0001234567890",
      "created_at": "2026-09-12T09:24:15+00:00"
    }
  ]
}
```

Kalau tidak ketemu, `data` berisi array kosong `[]` — **bukan** error 404. Ini penting untuk UI dashboard: kondisi "pasien tidak ditemukan" itu hasil valid, bukan kegagalan sistem.

---

## 3. Visit (Registrasi Kunjungan)

### `POST /visits`
*(Perlu token)*

Mendaftarkan kunjungan baru untuk pasien. Status awal selalu `pending_verification`.

**Request body:**
```json
{
  "patient_id": 1,
  "facility_id": 1,
  "polyclinic_id": null,
  "identification_method": "nik",
  "payment_method": "bpjs",
  "bpjs_number": "0001234567890",
  "referral_letter_number": null,
  "notes": null
}
```

Field wajib: `patient_id`, `facility_id`, `identification_method` (`jari_id`/`nik`/`fingerprint_simulation`/`qr_code`/`manual`), `payment_method` (`mandiri`/`bpjs`).

Kalau `payment_method = bpjs`, field `bpjs_number` **wajib** diisi (validasi otomatis di server, akan dapat `422` kalau kosong).

**Response `201`:**
```json
{
  "data": {
    "id": 1,
    "patient": { "id": 1, "jari_id": "JARI-2026-04821793", "name": "Siti Aminah" },
    "facility_id": 1,
    "polyclinic_id": null,
    "identification_method": "nik",
    "payment_method": "bpjs",
    "bpjs_number": "0001234567890",
    "referral_letter_number": null,
    "status": "pending_verification",
    "notes": null,
    "stage_history": [
      {
        "stage": "pending_verification",
        "notes": "Kunjungan dibuat, menunggu verifikasi petugas.",
        "changed_at": "2026-09-12T09:30:00+00:00"
      }
    ],
    "created_at": "2026-09-12T09:30:00+00:00"
  }
}
```

---

### `GET /visits/{id}`
*(Perlu token)*

Melihat detail kunjungan beserta histori lengkap perpindahan tahap.

**Response `200`:** sama seperti response `POST /visits`, dengan `stage_history` berisi semua tahap yang pernah dilalui.

**Response `404`** kalau ID tidak ditemukan:
```json
{ "message": "Kunjungan tidak ditemukan." }
```

---

### `PATCH /visits/{id}/stage`
*(Perlu token)*

Memindahkan kunjungan ke tahap berikutnya.

**Aturan urutan tahap (tidak boleh loncat):**

```
pending_verification → verified → registered → in_service → completed
                    ↘ cancelled (boleh dari tahap manapun sebelum completed)
```

**Request body:**
```json
{
  "stage": "verified",
  "notes": "Data cocok, KTP sesuai"
}
```

`stage` wajib salah satu dari: `verified`, `registered`, `in_service`, `completed`, `cancelled`. `notes` opsional.

**Response `200`:** object visit terbaru (format sama seperti `GET /visits/{id}`).

**Response `422`** kalau transisi tidak valid (misal loncat dari `pending_verification` langsung ke `in_service`):
```json
{ "message": "Tidak bisa pindah dari status 'pending_verification' ke 'in_service'." }
```

---

## Catatan untuk Frontend

- Semua response sukses dibungkus `{ "data": ... }` (standar Laravel API Resource).
- Field tanggal (`created_at`, `changed_at`, dll) format ISO 8601 (`2026-09-12T09:30:00+00:00`) — parse dengan library tanggal standar (`dayjs`, `date-fns`, dll), jangan manual string split.
- `jari_id` **selalu** di-generate backend. Frontend tidak pernah mengirim atau mengedit field ini.
- Kalau dapat `401` di endpoint manapun (selain `/login`), berarti token expired/invalid — arahkan user ke halaman login lagi.

## Belum tersedia (menyusul)

- Nomor Rekam Medis per faskes (`patient_facility_mappings`) — belum ada endpoint, belum terhubung ke `/visits`.
- Nomor antrean (`queues`) — belum ada endpoint, belum terhubung ke `/visits`.
- Simulasi fingerprint — belum ada endpoint.
- Dashboard/statistik faskes — belum ada endpoint.
