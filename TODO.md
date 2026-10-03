# Jari Center - Backend Fix Plan (MVP)

Plan ini sudah **selesai dieksekusi**. File ini dipertahankan sebagai arsip
status. Implementasi aktual lebih sederhana daripada rencana ini (YAGNI).

## Status Eksekusi

| Item | Status | Catatan |
|---|---|---|
| PolyclinicController@index | Selesai | Route `GET /api/polyclinics` sudah ada |
| VisitController@index | Selesai | Sudah ada filter `facility_id` & `date` |
| Authorization per faskes | Selesai | `User::canAccessFacility()` + cek di controller |
| Typo EloquentQueueRepository | Sudah tidak relevan | Tidak ditemukan di kode |
| null date_of_birth | Selesai | Pakai `?->format()` |
| Transaction use cases | Selesai | RegisterVisit, UpdateVisitStage, GenerateQueueNumber, AssignFacilityMedicalRecord |
| Race condition | Selesai | DB transaction + unique constraint (existing) |
| PHPUnit tests | Selesai | 46 tests, 141 assertions, all pass |
| Laravel Dusk | Dihapus | Di luar scope MVP (dibersihkan Fase 4) |
| API documentation | Selesai | `docs/03-api-documentation.md` sudah rapi |
| Postman collection | Selesai | Sudah update semua endpoint admin & variables |

## Fase yang Dikerjakan

0. visit_id persist + hapus fallback frontend — Selesai
1. Tutup 4 lubang otorisasi — Selesai
2. Seeder demo (poliklinik, kunjungan, antrean, mapping) — Selesai
3. Fingerprint connect ke endpoint — Selesai
4. Bersihkan kode mati (Dusk, patient_profiles, activities, orphan) — Selesai
5. Admin UI read-write (faskes & user) — Selesai
6. CORS, throttle login, token expiry, .env.example, docs — Selesai

## Acceptance Criteria

- [x] Semua endpoint yang dipanggil frontend sudah ada
- [x] Authorization bekerja dengan benar (tenant isolation)
- [x] Tidak ada bug kritis
- [x] Backend tests pass (46/46)
- [x] Frontend build berhasil (`npx vite build`)
- [x] Dokumentasi & Postman ter-update

MVP siap untuk demo.
