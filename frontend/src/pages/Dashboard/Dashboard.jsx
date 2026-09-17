import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Fingerprint,
  ScanFace,
  QrCode,
  Search,
  ShieldCheck,
  Users,
  Bell,
  AlertTriangle,
  ClipboardList,
  Droplet,
  Pill,
  UserPlus,
  LogIn,
  Tag,
  FileText,
  Siren,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react";
// api.js ada di src/components/, sedangkan Dashboard.jsx ada di src/pages/,
// jadi naik satu folder dulu baru masuk ke components/
import { getVisit, updateVisitStage } from "../../services/api";
import "./Dashboard.css";

// ============================================================
// KONFIGURASI — SESUAIKAN DENGAN ALUR ASLI KAMU
// ============================================================
// ID kunjungan (visit) yang lagi aktif di dashboard ini. Idealnya ini
// datang dari luar komponen — misalnya route param (/dashboard/:visitId),
// atau state global setelah pasien discan sidik jari / dicari lewat
// kotak pencarian di bawah. Selama masih null, dashboard nampilin
// data CONTOH (dummy) seperti sebelumnya, supaya tampilan tetap utuh.
const DEMO_VISIT_ID = 1; // contoh: ganti jadi 1, atau ambil dari useParams()

// Interval auto-refresh (polling) buat Status Verifikasi & Ringkasan Kesehatan
const AUTO_REFRESH_MS = 15000;

// Urutan tahap kunjungan dari backend (kolom "stage" di updateVisitStage).
// Sesuaikan value & label kalau nama stage di backend kamu beda.
const STAGE_OPTIONS = [
  { value: "verified", label: "Terverifikasi" },
  { value: "registered", label: "Menunggu" },
  { value: "in_service", label: "Sedang Dilayani" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const STAGE_PILL_CLASS = {
  verified: "db-pill-green",
  registered: "db-pill-orange",
  in_service: "db-pill-blue",
  completed: "db-pill-green",
  cancelled: "db-pill-red",
};

// ===== Data contoh (dipakai kalau DEMO_VISIT_ID masih null) =====
const dummyPasien = {
  nama: "Siti Aminah",
  status: "Pasien Aktif",
  foto: null,
  nik: "3175**********0021",
  noRM: "RM000987654",
  tglLahir: "12/05/1968",
  usia: "56 Tahun",
  jenisKelamin: "Perempuan",
};

const dummyAlergi = [{ nama: "Penisilin", tingkat: "Alergi Berat" }];
const dummyDiagnosaAlert = "Diabetes tipe 2";

const dummyAdministrasi = {
  pembayaran: "BPJS Aktif",
  poli: "Poli Penyakit Dalam",
  dokter: "dr. Budi Santoso, Sp.PD",
  noAntrean: "A-024",
  status: "registered",
};

const dummyKesehatan = {
  golonganDarah: "O+",
  diagnosa: "Hipertensi, Diabetes tipe 2",
  obatAktif: "Amlodipin, Metformin",
  kunjunganTerakhir: "15/04/2024",
};

const antrean = {
  jumlah: 5,
  saatIni: "A-024",
};

const notifikasi = [
  {
    id: 1,
    tipe: "warning",
    judul: "Sistem antrean mengalami peningkatan",
    keterangan: "Harap tetap monitor antrean",
    waktu: "09:15 WIB",
  },
  {
    id: 2,
    tipe: "info",
    judul: "Sinkronisasi data BPJS berhasil",
    keterangan: "Data terakhir diperbarui",
    waktu: "09:10 WIB",
  },
  {
    id: 3,
    tipe: "success",
    judul: "Pembaruan aplikasi tersedia",
    keterangan: "Versi terbaru: 2.3.1",
    waktu: "08:45 WIB",
  },
];

const tabs = [
  { key: "sidikjari", label: "Sidik Jari", icon: Fingerprint },
  { key: "face", label: "Face", icon: ScanFace },
  { key: "qr", label: "QR Code", icon: QrCode },
  { key: "cari", label: "Cari NIK / Nama", icon: Search },
];

const notifIcon = {
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
};

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sidikjari");

  const visitId = DEMO_VISIT_ID;

  const [visit, setVisit] = useState(null);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [visitError, setVisitError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const [adminStageMenuOpen, setAdminStageMenuOpen] = useState(false);
  const [verifStageMenuOpen, setVerifStageMenuOpen] = useState(false);
  const [changingStage, setChangingStage] = useState(false);

  const adminMenuRef = useRef(1);
  const verifMenuRef = useRef(1);

  // ============================================================
  // AMBIL DATA KUNJUNGAN DARI API
  // ============================================================
  const fetchVisit = useCallback(
    async ({ silent = false } = {}) => {
      if (!visitId) return; // mode demo — belum ada pasien teridentifikasi
      if (!silent) setLoadingVisit(true);
      setVisitError("");
      try {
        const data = await getVisit(visitId);
        setVisit(data);
        setLastSyncedAt(new Date());
      } catch (err) {
        setVisitError(err.message || "Gagal memuat data kunjungan.");
      } finally {
        if (!silent) setLoadingVisit(false);
      }
    },
    [visitId]
  );

  // Load pertama kali visitId berubah / komponen mount
  useEffect(() => {
    fetchVisit();
  }, [fetchVisit]);

  // Auto-refresh (polling) berkala — sesuai permintaan: Status Verifikasi
  // & Ringkasan Kesehatan ikut ter-update otomatis tiap AUTO_REFRESH_MS
  useEffect(() => {
    if (!visitId) return;
    const timer = setInterval(() => {
      fetchVisit({ silent: true });
    }, AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, [visitId, fetchVisit]);

  // Tutup dropdown ganti status kalau klik di luar area-nya
  useEffect(() => {
    function handleClickOutside(e) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
        setAdminStageMenuOpen(false);
      }
      if (verifMenuRef.current && !verifMenuRef.current.contains(e.target)) {
        setVerifStageMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleChangeStage(stage) {
    setAdminStageMenuOpen(false);
    setVerifStageMenuOpen(false);
    if (!visitId) return; // mode demo, belum ada visit asli buat di-update
    setChangingStage(true);
    try {
      await updateVisitStage(visitId, stage);
      await fetchVisit({ silent: true });
    } catch (err) {
      setVisitError(err.message || "Gagal mengubah status kunjungan.");
    } finally {
      setChangingStage(false);
    }
  }

  // ============================================================
  // MAP DATA API -> bentuk yang dipakai tampilan (fallback ke dummy
  // kalau belum ada visit asli). Sesuaikan nama field visit.xxx /
  // visit.patient.xxx di bawah ini dengan response asli backend kamu.
  // ============================================================
  const pasien = visit?.patient
    ? {
        nama: visit.patient.name,
        status: visit.patient.status_label || "Pasien Aktif",
        foto: visit.patient.photo_url || null,
        nik: visit.patient.nik,
        noRM: visit.patient.medical_record_number,
        tglLahir: visit.patient.date_of_birth,
        usia: visit.patient.age ? `${visit.patient.age} Tahun` : "-",
        jenisKelamin: visit.patient.gender,
      }
    : dummyPasien;

  // allergies diharapkan array of { name, severity } atau array of string
  const daftarAlergi = visit
    ? (visit.patient?.allergies || []).map((a) =>
        typeof a === "string" ? { nama: a, tingkat: "Alergi" } : { nama: a.name, tingkat: a.severity }
      )
    : dummyAlergi;

  const diagnosaAlert = visit
    ? (visit.patient?.diagnoses || []).join(", ")
    : dummyDiagnosaAlert;

  const administrasi = visit
    ? {
        pembayaran: visit.payment_method_label || visit.payment_method || "-",
        poli: visit.polyclinic_name || "-",
        dokter: visit.doctor_name || "-",
        noAntrean: visit.queue_number || "-",
        status: visit.stage || "registered",
      }
    : dummyAdministrasi;

  const kesehatan = visit?.patient?.health_summary
    ? {
        golonganDarah: visit.patient.health_summary.blood_type || "-",
        diagnosa: (visit.patient.health_summary.diagnoses || []).join(", ") || "-",
        obatAktif: (visit.patient.health_summary.active_medications || []).join(", ") || "-",
        kunjunganTerakhir: visit.patient.health_summary.last_visit_date || "-",
      }
    : dummyKesehatan;

  const isVerified = visit ? visit.stage === "verified" : true;
  const verifiedAt = visit?.verified_at || "09:24:15 WIB";

  const stageLabel =
    STAGE_OPTIONS.find((s) => s.value === administrasi.status)?.label ||
    administrasi.status;
  const stagePillClass = STAGE_PILL_CLASS[administrasi.status] || "db-pill-orange";

  return (
    <div className="db-content">
      <div className="db-main-col">
        {/* Identifikasi Pasien */}
        <section className="db-card">
          <h2 className="db-card-title">
            <Fingerprint size={18} />
            Identifikasi Pasien
          </h2>

          <div className="db-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  className={`db-tab ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="db-scan-area">
            <div className="db-scan-icon">
              <Fingerprint size={56} />
            </div>

            <span className="db-or">ATAU</span>

            <div className="db-search-box">
              <input
                type="text"
                placeholder="Tempel atau masukkan NIK / Nama pasien"
              />
              <button aria-label="Cari">
                <Search size={18} />
              </button>
            </div>
          </div>
          <p className="db-scan-hint">
            Letakkan jari pada scanner atau gunakan pencarian di atas
          </p>

          {visitError && <p className="db-error-text">{visitError}</p>}

          {/* Kartu Pasien */}
          <div className="db-patient">
            <div className="db-patient-photo">
              {pasien.foto ? (
                <img src={pasien.foto} alt={pasien.nama} />
              ) : (
                <span>{pasien.nama.charAt(0)}</span>
              )}
            </div>

            <div className="db-patient-info">
              <div className="db-patient-name">
                <h3>{pasien.nama}</h3>
                <span className="db-pill db-pill-green">
                  <CheckCircle2 size={14} />
                  {pasien.status}
                </span>
              </div>

              <div className="db-patient-grid">
                <div>
                  <span className="db-label">NIK</span>
                  <strong>{pasien.nik}</strong>
                </div>
                <div>
                  <span className="db-label">No. Rekam Medis</span>
                  <strong>{pasien.noRM}</strong>
                </div>
                <div>
                  <span className="db-label">Tanggal Lahir</span>
                  <strong>{pasien.tglLahir}</strong>
                </div>
                <div>
                  <span className="db-label">Usia</span>
                  <strong>{pasien.usia}</strong>
                </div>
                <div>
                  <span className="db-label">Jenis Kelamin</span>
                  <strong>{pasien.jenisKelamin}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 kartu info */}
        <div className="db-triple-grid">
          {/* ===== ALERT MEDIS — dari data API, bukan statis lagi ===== */}
          <section className="db-card db-card-alert">
            <h2 className="db-card-title db-title-red">
              <AlertTriangle size={18} />
              Alert Medis
            </h2>

            {daftarAlergi.length === 0 && !diagnosaAlert ? (
              <p className="db-empty-text">
                Tidak ada alergi atau diagnosa berisiko yang tercatat untuk
                pasien ini.
              </p>
            ) : (
              <>
                {daftarAlergi.map((a, idx) => (
                  <div className="db-alert-row" key={idx}>
                    <div>
                      <strong>Alergi: {a.nama}</strong>
                    </div>
                    <span className="db-pill db-pill-red">{a.tingkat}</span>
                  </div>
                ))}

                {diagnosaAlert && (
                  <div className="db-alert-row">
                    <Droplet size={16} className="db-alert-icon" />
                    <div>
                      <strong>Diagnosa: {diagnosaAlert}</strong>
                    </div>
                  </div>
                )}
              </>
            )}

            <button className="db-link">
              Lihat detail riwayat medis
              <ChevronRight size={16} />
            </button>
          </section>

          {/* ===== STATUS ADMINISTRASI — pill "Status" bisa diklik ===== */}
          <section className="db-card">
            <h2 className="db-card-title db-title-green">
              <ClipboardList size={18} />
              Status Administrasi
            </h2>

            <ul className="db-kv-list">
              <li>
                <span>Pembayaran</span>
                <span className="db-pill db-pill-green">
                  {administrasi.pembayaran}
                </span>
              </li>
              <li>
                <span>Poli Tujuan</span>
                <strong>{administrasi.poli}</strong>
              </li>
              <li>
                <span>Dokter</span>
                <strong>{administrasi.dokter}</strong>
              </li>
              <li>
                <span>No. Antrean</span>
                <span className="db-pill db-pill-blue">
                  {administrasi.noAntrean}
                </span>
              </li>
              <li className="db-status-clickable-row" ref={adminMenuRef}>
                <span>Status</span>
                <button
                  type="button"
                  className={`db-pill db-pill-button ${stagePillClass}`}
                  onClick={() => setAdminStageMenuOpen((o) => !o)}
                  disabled={changingStage}
                >
                  {stageLabel}
                  <ChevronDown size={12} />
                </button>

                {adminStageMenuOpen && (
                  <div className="db-stage-menu">
                    {STAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className="db-stage-menu-item"
                        onClick={() => handleChangeStage(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </section>

          {/* ===== RINGKASAN KESEHATAN — auto-refresh ===== */}
          <section className="db-card">
            <h2 className="db-card-title">
              <Pill size={18} />
              Ringkasan Kesehatan
            </h2>

            <ul className="db-kv-list">
              <li>
                <span>Golongan Darah</span>
                <span className="db-pill db-pill-red">
                  {kesehatan.golonganDarah}
                </span>
              </li>
              <li>
                <span>Diagnosa</span>
                <strong>{kesehatan.diagnosa}</strong>
              </li>
              <li>
                <span>Obat Aktif</span>
                <strong>{kesehatan.obatAktif}</strong>
              </li>
              <li>
                <span>Kunjungan Terakhir</span>
                <strong>{kesehatan.kunjunganTerakhir}</strong>
              </li>
            </ul>

            <p className="db-sync-note">
              <RefreshCw size={12} className={loadingVisit ? "db-spin" : ""} />
              Auto-refresh tiap {AUTO_REFRESH_MS / 1000}s
              {lastSyncedAt &&
                ` • Terakhir: ${lastSyncedAt.toLocaleTimeString("id-ID")}`}
            </p>
          </section>
        </div>

        {/* Aksi Cepat */}
        <section>
          <h2 className="db-section-title">Aksi Cepat</h2>
          <div className="db-actions">
            <button
              className="db-action db-action-blue"
              onClick={() => navigate("/registrasi-pasien")}
            >
              <UserPlus size={18} />
              Registrasi
            </button>
            <button
              className="db-action db-action-green"
              onClick={() => navigate("/antrian")}
            >
              <LogIn size={18} />
              Masuk Poli
            </button>
            <button
              className="db-action db-action-teal"
              onClick={() => window.print()}
            >
              <Tag size={18} />
              Cetak Gelang
            </button>
            <button
              className="db-action db-action-purple"
              onClick={() => navigate("/farmasi")}
            >
              <FileText size={18} />
              Resep
            </button>
            <button
              className="db-action db-action-red"
              onClick={() => navigate("/igd")}
            >
              <Siren size={18} />
              Mode IGD
            </button>
          </div>
        </section>
      </div>

      {/* ===== SIDEBAR KANAN ===== */}
      <aside className="db-side-col">
        {/* ===== STATUS VERIFIKASI — bisa diklik + auto-refresh ===== */}
        <section className="db-card">
          <h2 className="db-card-title db-title-green">
            <ShieldCheck size={18} />
            Status Verifikasi
          </h2>

          <div ref={verifMenuRef}>
            <button
              type="button"
              className="db-verif db-verif-clickable"
              onClick={() => setVerifStageMenuOpen((o) => !o)}
              disabled={changingStage}
            >
              <div
                className={`db-verif-icon ${
                  isVerified ? "" : "db-verif-icon-pending"
                }`}
              >
                <CheckCircle2 size={22} />
              </div>
              <span
                className={`db-verif-label ${
                  isVerified ? "" : "db-verif-label-pending"
                }`}
              >
                {isVerified ? "Terverifikasi" : "Belum Terverifikasi"}
              </span>
              <ChevronDown size={16} className="db-verif-chevron" />
            </button>

            {verifStageMenuOpen && (
              <div className="db-stage-menu db-stage-menu-block">
                {STAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className="db-stage-menu-item"
                    onClick={() => handleChangeStage(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="db-verif-desc">
            Identitas pasien cocok dengan data rekam medis.
            <br />
            Waktu verifikasi: {verifiedAt}
          </p>

          <p className="db-sync-note">
            <RefreshCw size={12} className={loadingVisit ? "db-spin" : ""} />
            Auto-refresh tiap {AUTO_REFRESH_MS / 1000}s
          </p>
        </section>

        <section className="db-card">
          <h2 className="db-card-title">
            <Users size={18} />
            Jumlah Antrean
          </h2>

          <div className="db-antrean-count">
            <strong>{antrean.jumlah}</strong>
            <span>pasien menunggu</span>
          </div>

          <div className="db-antrean-current">
            <span>Antrean Saat Ini</span>
            <span className="db-pill db-pill-blue">{antrean.saatIni}</span>
          </div>

          <button className="db-link" onClick={() => navigate("/antrian")}>
            Lihat daftar antrean
            <ChevronRight size={16} />
          </button>
        </section>

        <section className="db-card">
          <div className="db-notif-header">
            <h2 className="db-card-title">
              <Bell size={18} />
              Notifikasi
            </h2>
            <button
              className="db-link-sm"
              onClick={() => navigate("/pengaturan")}
            >
              Lihat semua
            </button>
          </div>

          <ul className="db-notif-list">
            {notifikasi.map((n) => (
              <li key={n.id} className={`db-notif-item db-notif-${n.tipe}`}>
                <span className="db-notif-icon">{notifIcon[n.tipe]}</span>
                <div>
                  <strong>{n.judul}</strong>
                  <p>{n.keterangan}</p>
                </div>
                <span className="db-notif-time">{n.waktu}</span>
              </li>
            ))}
          </ul>

          <button className="db-link" onClick={() => navigate("/pengaturan")}>
            Lihat semua notifikasi
            <ChevronRight size={16} />
          </button>
        </section>
      </aside>
    </div>
  );
}

export default Dashboard;