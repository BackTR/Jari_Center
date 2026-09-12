import { useState } from "react";
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
  CheckCircle2,
  Info,
} from "lucide-react";
import "./Dashboard.css";

// Data contoh — ganti dengan data dari API kamu nantinya
const pasien = {
  nama: "Siti Aminah",
  status: "Pasien Aktif",
  foto: null, // taruh URL foto pasien di sini
  nik: "3175**********0021",
  noRM: "RM000987654",
  tglLahir: "12/05/1968",
  usia: "56 Tahun",
  jenisKelamin: "Perempuan",
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
  const [activeTab, setActiveTab] = useState("sidikjari");

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
          <section className="db-card db-card-alert">
            <h2 className="db-card-title db-title-red">
              <AlertTriangle size={18} />
              Alert Medis
            </h2>

            <div className="db-alert-row">
              <div>
                <strong>Alergi: Penisilin</strong>
              </div>
              <span className="db-pill db-pill-red">Alergi Berat</span>
            </div>

            <div className="db-alert-row">
              <Droplet size={16} className="db-alert-icon" />
              <div>
                <strong>Diagnosa: Diabetes tipe 2</strong>
              </div>
            </div>

            <button className="db-link">
              Lihat detail riwayat medis
              <ChevronRight size={16} />
            </button>
          </section>

          <section className="db-card">
            <h2 className="db-card-title db-title-green">
              <ClipboardList size={18} />
              Status Administrasi
            </h2>

            <ul className="db-kv-list">
              <li>
                <span>Pembayaran</span>
                <span className="db-pill db-pill-green">BPJS Aktif</span>
              </li>
              <li>
                <span>Poli Tujuan</span>
                <strong>Poli Penyakit Dalam</strong>
              </li>
              <li>
                <span>Dokter</span>
                <strong>dr. Budi Santoso, Sp.PD</strong>
              </li>
              <li>
                <span>No. Antrean</span>
                <span className="db-pill db-pill-blue">A-024</span>
              </li>
              <li>
                <span>Status</span>
                <span className="db-pill db-pill-orange">Menunggu</span>
              </li>
            </ul>
          </section>

          <section className="db-card">
            <h2 className="db-card-title">
              <Pill size={18} />
              Ringkasan Kesehatan
            </h2>

            <ul className="db-kv-list">
              <li>
                <span>Golongan Darah</span>
                <span className="db-pill db-pill-red">O+</span>
              </li>
              <li>
                <span>Diagnosa</span>
                <strong>Hipertensi, Diabetes tipe 2</strong>
              </li>
              <li>
                <span>Obat Aktif</span>
                <strong>Amlodipin, Metformin</strong>
              </li>
              <li>
                <span>Kunjungan Terakhir</span>
                <strong>15/04/2024</strong>
              </li>
            </ul>
          </section>
        </div>

        {/* Aksi Cepat */}
        <section>
          <h2 className="db-section-title">Aksi Cepat</h2>
          <div className="db-actions">
            <button className="db-action db-action-blue">
              <UserPlus size={18} />
              Registrasi
            </button>
            <button className="db-action db-action-green">
              <LogIn size={18} />
              Masuk Poli
            </button>
            <button className="db-action db-action-teal">
              <Tag size={18} />
              Cetak Gelang
            </button>
            <button className="db-action db-action-purple">
              <FileText size={18} />
              Resep
            </button>
            <button className="db-action db-action-red">
              <Siren size={18} />
              Mode IGD
            </button>
          </div>
        </section>
      </div>

      {/* ===== SIDEBAR KANAN ===== */}
      <aside className="db-side-col">
        <section className="db-card">
          <h2 className="db-card-title db-title-green">
            <ShieldCheck size={18} />
            Status Verifikasi
          </h2>

          <div className="db-verif">
            <div className="db-verif-icon">
              <CheckCircle2 size={22} />
            </div>
            <span className="db-verif-label">Terverifikasi</span>
          </div>

          <p className="db-verif-desc">
            Identitas pasien cocok dengan data rekam medis.
            <br />
            Waktu verifikasi: 09:24:15 WIB
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

          <button className="db-link">
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
            <button className="db-link-sm">Lihat semua</button>
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

          <button className="db-link">
            Lihat semua notifikasi
            <ChevronRight size={16} />
          </button>
        </section>
      </aside>
    </div>
  );
}

export default Dashboard;