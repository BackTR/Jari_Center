# Jari Center - Backend Fix Plan (MVP)

## 🎯 Objective
Perbaiki backend agar MVP ready untuk demo. Fokus pada:
1. Endpoint lengkap
2. Authorization proper
3. Bug fixes
4. Testing (PHPUnit + Laravel Dusk)
5. Update dokumentasi

---

## 📋 Phase 1: Backend Fixes

### 1.1 Fix Endpoint Hilang

#### A. Buat `PolyclinicController@index`
- **File baru:** `backend/app/Http/Controllers/Api/PolyclinicController.php`
- **Route baru:** `GET /api/polyclinics?facility_id={id}`
- **Response:** Daftar poliklinik per faskes
- **Authorization:** Hanya user yang punya akses ke faskes tersebut

#### B. Buat `VisitController@index`
- **File update:** `backend/app/Http/Controllers/Api/VisitController.php`
- **Route baru:** `GET /api/visits?facility_id={id}&date={date}`
- **Response:** Daftar kunjungan per faskes dengan pagination
- **Authorization:** Hanya user yang punya akses ke faskes tersebut

#### C. Update `QueueController@index` atau sesuaikan frontend
- **Opsi 1:** Buat `QueueController@index` global
- **Opsi 2:** Update frontend untuk menggunakan `/api/facilities/{facilityId}/queues`
- **Rekomendasi:** Opsi 2 (konsisten dengan pattern yang ada)

---

### 1.2 Fix Authorization

#### A. Buat `FacilityAccessPolicy` atau trait
- **File baru:** `backend/app/Policies/FacilityPolicy.php` atau `backend/app/Traits/ChecksFacilityAccess.php`
- **Method:** `canAccessFacility(User $user, int $facilityId): bool`
- **Logic:** `super_admin` bisa akses semua, `petugas` hanya faskes sendiri

#### B. Update semua controller
- `PatientController@store` - tambah facility check
- `PatientController@identify` - tambah facility filter
- `VisitController@store` - tambah facility check
- `VisitController@show` - tambah facility check
- `VisitController@updateStage` - tambah facility check
- `FingerprintController@enroll` - tambah facility check
- `FingerprintController@match` - tambah facility filter

---

### 1.3 Fix Backend Bugs

#### A. Fix typo di `EloquentQueueRepository`
- **File:** `backend/app/Infrastructure/Persistence/Eloquent/EloquentQueueRepository.php:28`
- **Fix:** `polyclinic_Id` → `polyclinic_id`

#### B. Fix N+1 query di `VisitResource`
- **File:** `backend/app/Http/Resources/VisitResource.php`
- **Solusi:** Eager load `facilityMappings` di repository
- **Atau:** Gunakan `load()` di controller

#### C. Fix null date_of_birth di `PatientResource`
- **File:** `backend/app/Http/Resources/PatientResource.php:22`
- **Fix:** `$this->date_of_birth?->format('Y-m-d')`

#### D. Add transaction di `RegisterVisitUseCase`
- **File:** `backend/app/Application/Visit/RegisterVisitUseCase.php`
- **Fix:** Wrap dalam `DB::transaction()`

#### E. Add transaction di `UpdateVisitStageUseCase`
- **File:** `backend/app/Application/Visit/UpdateVisitStageUseCase.php`
- **Fix:** Wrap dalam `DB::transaction()`

#### F. Fix race condition di `GenerateQueueNumberService`
- **File:** `backend/app/Application/Visit/GenerateQueueNumberService.php`
- **Solusi:** Unique constraint + retry mechanism

#### G. Fix race condition di `AssignFacilityMedicalRecordService`
- **File:** `backend/app/Application/Patient/AssignFacilityMedicalRecordService.php`
- **Solusi:** Unique constraint + retry mechanism

---

### 1.4 Testing

#### A. PHPUnit Tests
- **Unit Tests:**
  - `JariIdGeneratorServiceTest`
  - `FingerprintSimulationServiceTest`
  - `GenerateQueueNumberServiceTest`
  - `AssignFacilityMedicalRecordServiceTest`

- **Feature Tests:**
  - `AuthTest` - login, logout
  - `PatientTest` - create, identify
  - `VisitTest` - create, update stage
  - `DashboardTest` - facility access
  - `FingerprintTest` - enroll, match

#### B. Laravel Dusk Tests
- **Browser Tests:**
  - `LoginTest` - halaman login
  - `PatientRegistrationTest` - form registrasi pasien
  - `VisitRegistrationTest` - form registrasi kunjungan
  - `DashboardTest` - halaman dashboard
  - `AntrianTest` - halaman antrean

---

### 1.5 Update Dokumentasi

#### A. Update API Documentation
- **File:** `backend/docs/03-api-documentation.md`
- **Update:**
  - Tambah endpoint `GET /api/polyclinics`
  - Tambah endpoint `GET /api/visits` (list)
  - Update response format
  - Tambah error responses

#### B. Update Postman Collection
- **File:** `backend/docs/JariCenter.postman_collection.json`
- **Update:**
  - Tambah request untuk endpoint baru
  - Update request yang sudah ada

---

## 📝 Implementation Order

### Step 1: Fix Bugs Cepat (Quick Wins)
1. Fix typo di EloquentQueueRepository
2. Fix null date_of_birth di PatientResource
3. Add return type declarations

### Step 2: Add Endpoint Hilang
4. Buat PolyclinicController
5. Buat VisitController@index
6. Update routes/api.php

### Step 3: Fix Authorization
7. Buat FacilityAccessPolicy/Trait
8. Update semua controller

### Step 4: Fix Data Integrity
9. Add transaction di use cases
10. Fix race condition

### Step 5: Testing
11. Buat PHPUnit tests
12. Buat Laravel Dusk tests

### Step 6: Documentation
13. Update API documentation
14. Update Postman collection

---

## ✅ Acceptance Criteria

- [ ] Semua endpoint yang dipanggil frontend sudah ada
- [ ] Authorization bekerja dengan benar
- [ ] Tidak ada bug yang tersisa
- [ ] PHPUnit tests pass
- [ ] Laravel Dusk tests pass
- [ ] API documentation updated
- [ ] Postman collection updated

---

## 🚀 Ready for Demo

Setelah semua di atas selesai, MVP akan ready untuk demo dengan fitur:
- ✅ Login/Logout
- ✅ Patient Registration
- ✅ Patient Identification
- ✅ Visit Registration
- ✅ Visit Stage Tracking
- ✅ Queue Management
- ✅ Dashboard
- ✅ Fingerprint Simulation
