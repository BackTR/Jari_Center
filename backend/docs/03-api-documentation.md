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
    "medical_record_number": "RM000000001",
    "queue": { "queue_number": "P-001", "queue_date": "2026-09-12" },
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

Setiap kali visit dibuat, server otomatis:
- Mencari/membuat **Nomor Rekam Medis** pasien di faskes itu (`medical_record_number`) — tetap sama kalau pasien sudah pernah berobat di faskes yang sama.
- Membuat **nomor antrean** baru (`queue`) — sequential per faskes+poli+tanggal, reset tiap hari.

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

## 4. Dashboard Faskes

### `GET /facilities/{facilityId}/dashboard`
*(Perlu token)*

Ringkasan kunjungan per faskes untuk 1 hari tertentu. Petugas hanya bisa akses dashboard faskes tempat dia bertugas (`facility_id` miliknya sendiri); `super_admin` bisa akses semua faskes.

**Query params:**
| Param | Wajib | Nilai |
|---|---|---|
| `date` | tidak | format `YYYY-MM-DD`, default hari ini |

**Contoh:** `GET /facilities/1/dashboard?date=2026-09-12`

**Response `200`:**
```json
{
  "data": {
    "date": "2026-09-12",
    "total_visits_today": 3,
    "by_status": {
      "pending_verification": 1,
      "verified": 0,
      "registered": 1,
      "in_service": 0,
      "completed": 1,
      "cancelled": 0
    },
    "by_payment_method": { "mandiri": 1, "bpjs": 2 },
    "recent_visits": [
      {
        "id": 3,
        "patient_id": 2,
        "status": "completed",
        "payment_method": "bpjs",
        "created_at": "2026-09-12T10:15:00+00:00",
        "patient": { "id": 2, "jari_id": "JARI-2026-01122334", "name": "Budi Santoso" }
      }
    ]
  }
}
```

**Response `403`** (akses ke faskes lain, bukan `super_admin`):
```json
{ "message": "Anda tidak memiliki akses ke dashboard faskes ini." }
```

---

### `GET /facilities/{facilityId}/queues`
*(Perlu token)*

Daftar antrean hari ini di faskes tersebut, urut berdasarkan nomor antrean. Otorisasi sama seperti endpoint dashboard di atas (hanya faskes sendiri, kecuali `super_admin`).

> Field status bernama `visit_status`, bukan `status`. Antrean tidak punya tahap sendiri — tahap antrean **adalah** tahap kunjungan (`visits.status`). Client cukup baca satu sumber itu.

**Query params:**
| Param | Wajib | Nilai |
|---|---|---|
| `polyclinic_id` | tidak | filter ke satu poli tertentu |
| `date` | tidak | format `YYYY-MM-DD`, default hari ini |

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "visit_id": 1,
      "queue_number": "P-001",
      "visit_status": "pending_verification",
      "polyclinic": "Poli Penyakit Dalam",
      "patient": { "jari_id": "JARI-2026-04821793", "name": "Siti Aminah" }
    }
  ]
}
```

---

## 5. Fingerprint Simulation

> ⚠️ **Simulasi, bukan biometric matching sungguhan.** Sistem ini mencocokkan hash persis dari string template yang dikirim client. Fingerprint asli menghasilkan template yang sedikit berbeda tiap scan dan butuh *fuzzy matching* dengan threshold kemiripan — di luar scope MVP ini. Cukup untuk mensimulasikan alur "Identifikasi via Sidik Jari" di dashboard, tidak untuk keamanan biometrik produksi.

### `POST /patients/{patientId}/fingerprint/enroll`
*(Perlu token)*

Mendaftarkan "template" sidik jari (string apa saja yang mewakili hasil scan simulasi) ke seorang pasien.

**Request body:**
```json
{ "template": "SIMULATED_FP_TEMPLATE_SITI_AMINAH_001" }
```

**Response `200`:**
```json
{
  "message": "Sidik jari berhasil didaftarkan (simulasi).",
  "data": { "id": 1, "jari_id": "JARI-2026-04821793", "name": "Siti Aminah", "...": "..." }
}
```

**Response `409`** (template sudah terdaftar atas pasien lain):
```json
{ "message": "Sidik jari ini sudah terdaftar atas pasien lain." }
```

**Response `404`** kalau `patientId` tidak ditemukan.

---

### `POST /fingerprint/match`
*(Perlu token)*

Mencari pasien berdasarkan template sidik jari — dipakai di panel "Identifikasi Pasien" tab Sidik Jari pada dashboard.

**Request body:**
```json
{ "template": "SIMULATED_FP_TEMPLATE_SITI_AMINAH_001" }
```

**Response `200`** (cocok):
```json
{
  "matched": true,
  "message": "Pasien teridentifikasi.",
  "data": { "id": 1, "jari_id": "JARI-2026-04821793", "name": "Siti Aminah", "...": "..." }
}
```

**Response `200`** (tidak cocok — bukan error, hasil valid):
```json
{ "matched": false, "message": "Sidik jari tidak cocok dengan data pasien manapun.", "data": null }
```

---

## 6. Polyclinic

### `GET /polyclinics`
*(Perlu token)*

Mendapatkan daftar poliklinik aktif untuk fasilitas tertentu.

**Query params:**
| Param | Wajib | Nilai |
|---|---|---|
| `facility_id` | ya | ID fasilitas kesehatan |

**Contoh:** `GET /polyclinics?facility_id=1`

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "facility_id": 1,
      "name": "Poli Penyakit Dalam",
      "code": "PD",
      "is_active": true
    }
  ]
}
```

**Response `403`** (akses ke faskes lain, bukan `super_admin`):
```json
{ "message": "Anda tidak memiliki akses ke faskes ini." }
```

---

## 7. Visit (List)

### `GET /visits`
*(Perlu token)*

Mendapatkan daftar kunjungan untuk fasilitas tertentu dengan pagination.

**Query params:**
| Param | Wajib | Nilai |
|---|---|---|
| `facility_id` | ya | ID fasilitas kesehatan |
| `date` | tidak | format `YYYY-MM-DD`, default hari ini |

**Contoh:** `GET /visits?facility_id=1&date=2026-09-12`

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "patient": { "id": 1, "jari_id": "JARI-2026-04821793", "name": "Siti Aminah" },
      "facility_id": 1,
      "polyclinic_id": null,
      "polyclinic_name": null,
      "queue_number": "P-001",
      "status": "pending_verification",
      "payment_method": "bpjs",
      "created_at": "2026-09-12T09:30:00+00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

**Response `403`** (akses ke faskes lain, bukan `super_admin`):
```json
{ "message": "Anda tidak memiliki akses ke faskes ini." }
```

---

## 8. Admin (Super Admin Only)

Semua endpoint di bawah ini hanya bisa diakses oleh user dengan role `super_admin`.

### `GET /api/admin/dashboard`
*(Perlu token + role super_admin)*

Statistik global sistem.

**Response `200`:**
```json
{
  "data": {
    "total_patients": 1234,
    "total_visits_today": 567,
    "total_facilities": 12,
    "total_users": 45,
    "visits_last_7_days": [
      { "date": "2026-09-06", "total": 45 },
      { "date": "2026-09-07", "total": 52 }
    ],
    "patients_last_7_days": [
      { "date": "2026-09-06", "total": 12 },
      { "date": "2026-09-07", "total": 15 }
    ]
  }
}
```

---

### `GET /api/admin/facilities`
*(Perlu token + role super_admin)*

Daftar semua faskes dengan pagination.

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "RSUD Pirngadi",
      "type": "hospital",
      "code": "FAC0001",
      "address": "Jl. Merdeka No. 10",
      "phone": "021-1234567",
      "is_active": true,
      "users_count": 10,
      "visits_count": 150,
      "created_at": "2026-09-12T09:24:15+00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 20,
    "total": 25
  }
}
```

---

### `POST /api/admin/facilities`
*(Perlu token + role super_admin)*

Tambah faskes baru.

**Request body:**
```json
{
  "name": "RSUD Baru",
  "type": "hospital",
  "code": "FAC0002",
  "address": "Jl. Baru No. 1",
  "phone": "021-7654321"
}
```

**Response `201`:**
```json
{
  "message": "Faskes berhasil ditambahkan.",
  "data": { "id": 2, "name": "RSUD Baru", ... }
}
```

---

### `PUT /api/admin/facilities/{id}`
*(Perlu token + role super_admin)*

Edit faskes.

**Request body:**
```json
{
  "name": "RSUD Pirngadi Medan",
  "is_active": false
}
```

**Response `200`:**
```json
{
  "message": "Faskes berhasil diperbarui.",
  "data": { "id": 1, "name": "RSUD Pirngadi Medan", ... }
}
```

---

### `GET /api/admin/users`
*(Perlu token + role super_admin)*

Daftar semua user dengan pagination.

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Andi Pratama",
      "email": "andi@jaricenter.test",
      "role": "petugas_registrasi",
      "facility_id": 1,
      "facility_name": "RSUD Pirngadi",
      "is_active": true,
      "created_at": "2026-09-12T09:24:15+00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 20,
    "total": 45
  }
}
```

---

### `POST /api/admin/users`
*(Perlu token + role super_admin)*

Tambah user baru.

**Request body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@jaricenter.test",
  "password": "password123",
  "role": "petugas_registrasi",
  "facility_id": 1
}
```

**Response `201`:**
```json
{
  "message": "User berhasil ditambahkan.",
  "data": { "id": 2, "name": "Budi Santoso", ... }
}
```

---

### `PUT /api/admin/users/{id}`
*(Perlu token + role super_admin)*

Edit user.

**Request body:**
```json
{
  "name": "Budi Santoso Updated",
  "role": "perawat",
  "is_active": false
}
```

**Response `200`:**
```json
{
  "message": "User berhasil diperbarui.",
  "data": { "id": 2, "name": "Budi Santoso Updated", ... }
}
```

---

### `PATCH /api/admin/users/{id}/reset-password`
*(Perlu token + role super_admin)*

Reset password user.

**Request body:**
```json
{
  "password": "newpassword123"
}
```

**Response `200`:**
```json
{
  "message": "Password berhasil direset."
}
```

---

## Catatan untuk Frontend

- Semua response sukses dibungkus `{ "data": ... }` (standar Laravel API Resource).
- Field tanggal (`created_at`, `changed_at`, dll) format ISO 8601 (`2026-09-12T09:30:00+00:00`) — parse dengan library tanggal standar (`dayjs`, `date-fns`, dll), jangan manual string split.
- `jari_id` **selalu** di-generate backend. Frontend tidak pernah mengirim atau mengedit field ini.
- Kalau dapat `401` di endpoint manapun (selain `/login`), berarti token expired/invalid — arahkan user ke halaman login lagi. Token berlaku 12 jam.
- `POST /login` dibatasi 5 percobaan per menit per IP. KelLebihannya dapat `429`.
- Endpoint admin (`/admin/*`) hanya untuk `super_admin`; selain itu dapat `403`.

## Status MVP

Semua modul inti dari brief sudah tersedia: Auth, Patient Identity, Jari ID Generator, Patient Facility Mapping (Nomor RM), Queue, Visit Registration dengan stage tracking, Dashboard Faskes, Fingerprint Simulation, dan CRUD faskes/user.

Endpoint yang sengaja dihapus: `/admin/activities` (tidak ada tabel audit) dan `/patients/{id}/profile` (tabel `patient_profiles` tidak pernah dipakai).

**Belum tersedia (di luar scope MVP, tidak dikerjakan kecuali ada permintaan):**
- Integrasi SATUSEHAT (OAuth + FHIR Client + IHS Patient ID)
- Rekam medis penuh, resep, hasil lab detail
- Mode IGD (alur darurat terpisah)
- Log aktivitas (butuh tabel audit)
- RBAC granular per role — selain `super_admin`, semua role non-admin punya hak akses API yang sama dan hanya dibatasi cakupan faskes
