import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  Bell,
  ChevronDown,
  LayoutGrid,
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  Siren,
  CalendarDays,
  Receipt,
  FlaskConical,
  Pill,
  FileText,
  Settings,
  LogOut,
  User,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { logout, getUser } from "../../services/api";

// Data contoh — ganti dengan hasil GET /notifications begitu endpoint-nya ada
const notifikasiContoh = [
  {
    id: 1,
    tipe: "warning",
    judul: "Sistem antrean mengalami peningkatan",
    waktu: "09:15 WIB",
  },
  {
    id: 2,
    tipe: "info",
    judul: "Sinkronisasi data BPJS berhasil",
    waktu: "09:10 WIB",
  },
  {
    id: 3,
    tipe: "success",
    judul: "Pembaruan aplikasi tersedia (v2.3.1)",
    waktu: "08:45 WIB",
  },
];

const notifIcon = {
  warning: <AlertTriangle size={15} />,
  info: <Info size={15} />,
  success: <CheckCircle2 size={15} />,
};

// Isi menu dropdown menu grid. Path sudah disambungkan ke semua halaman
// yang diminta — kalau nanti ada yang pindah lokasi, tinggal ganti di sini.
const accountMenuItems = [
  { label: "Menu Utama", path: "/", icon: LayoutDashboard },
  { label: "Registrasi Pasien", path: "/registrasi-pasien", icon: UserPlus },
  { label: "Data Pasien", path: "#", icon: Users }, // TODO: ganti kalau halaman Data Pasien sudah ada route-nya
  { label: "Rekam Medis", path: "/rekammedis", icon: ClipboardList },
  { label: "IGD", path: "/igd", icon: Siren },
  { label: "Antrian", path: "/antrian", icon: CalendarDays },
  { label: "Billing", path: "/billing", icon: Receipt },
  { label: "Laboratorium", path: "/laboratorium", icon: FlaskConical },
  { label: "Farmasi", path: "/farmasi", icon: Pill },
  { label: "Laporan", path: "#", icon: FileText }, // TODO: ganti kalau halaman Laporan sudah ada route-nya
  { label: "Pengaturan", path: "/pengaturan", icon: Settings },
];

function Header({
  petugas = { nama: "Andi Pratama", role: "Petugas Pendaftaran" },
  unit = { nama: "RS Sehat Abadi", role: "Unit Pendaftaran" },
  syncTime = "09:24:31 WIB",
  notifCount = 3,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const notifRef = useRef(null);

  // Kalau user sudah login, pakai data asli dari token/localStorage.
  // Kalau belum ada (mis. lagi development tanpa login), pakai default di atas.
  const user = getUser();
  const displayPetugas = user
    ? { nama: user.name, role: formatRole(user.role) }
    : petugas;
  const userInitials = getInitials(displayPetugas.nama);

  // Tutup dropdown kalau klik di luar area menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setAvatarOpen(false);
    await logout();
    navigate("/login");
  }

  return (
    <header className="app-header">
      {/* Logo diambil dari public/Jari Center.jpg — nama file di public
          ada spasinya, jadi ditulis %20 supaya valid sebagai URL */}
      <div className="app-header-logo">
        <img
          src="/Jari%20Center.jpg"
          alt="Jari Center"
          className="app-header-logo-img"
        />
      </div>

      <div className="app-header-right">
        <div className="app-header-item">
          <Users size={18} />
          <div>
            <strong>{displayPetugas.nama}</strong>
            <span>{displayPetugas.role}</span>
          </div>
        </div>

        <div className="app-header-item">
          <Building2 size={18} />
          <div>
            <strong>{unit.nama}</strong>
            <span>{unit.role}</span>
          </div>
        </div>

        <div className="app-header-item app-header-sync">
          <span className="app-header-sync-dot" />
          <div>
            <strong>Sistem Tersinkronisasi</strong>
            <span>Terakhir: {syncTime}</span>
          </div>
        </div>

        <div className="app-header-menu" ref={notifRef}>
          <button
            className="app-header-icon-btn"
            onClick={() => setNotifOpen((open) => !open)}
            aria-expanded={notifOpen}
            aria-label="Notifikasi"
          >
            <Bell size={20} />
            {notifCount > 0 && (
              <span className="app-header-badge">{notifCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="account-menu notif-dropdown">
              <div className="notif-dropdown-header">
                <strong>Notifikasi</strong>
                <button
                  className="db-link-sm"
                  onClick={() => {
                    setNotifOpen(false);
                    navigate("/pengaturan");
                  }}
                >
                  Lihat semua
                </button>
              </div>

              <ul className="notif-dropdown-list">
                {notifikasiContoh.map((n) => (
                  <li key={n.id} className={`notif-dropdown-item notif-${n.tipe}`}>
                    <span className="notif-dropdown-icon">{notifIcon[n.tipe]}</span>
                    <div>
                      <strong>{n.judul}</strong>
                      <span>{n.waktu}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ===== TOMBOL MENU (dropdown navigasi ke semua modul) ===== */}
        <div className="app-header-menu" ref={menuRef}>
          <button
            className="app-header-icon-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            <LayoutGrid size={20} />
          </button>

          {menuOpen && (
            <div className="account-menu">
              <div className="account-menu-brand">
                <img
                  src="/Jari%20Center.jpg"
                  alt="Jari Center"
                  className="account-menu-brand-logo"
                />
                <strong>Jari Center</strong>
              </div>

              <nav className="account-menu-list">
                {accountMenuItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={`${item.label}-${idx}`}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `account-menu-item ${isActive ? "active" : ""}`
                      }
                    >
                      <Icon size={16} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* ===== TOMBOL AVATAR (dropdown profil + logout) ===== */}
        <div className="app-header-menu" ref={avatarRef}>
          <button
            className="app-header-avatar-btn"
            onClick={() => setAvatarOpen((open) => !open)}
            aria-expanded={avatarOpen}
            aria-label="Akun"
          >
            <span className="app-header-avatar">{userInitials}</span>
            <ChevronDown size={16} />
          </button>

          {avatarOpen && (
            <div className="account-menu account-menu-narrow">
              <div className="account-menu-brand">
                <span className="app-header-avatar app-header-avatar-sm">
                  {userInitials}
                </span>
                <div>
                  <strong>{displayPetugas.nama}</strong>
                  <span className="account-menu-role">{displayPetugas.role}</span>
                </div>
              </div>

              <nav className="account-menu-list">
                <NavLink
                  to="/pengaturan"
                  onClick={() => setAvatarOpen(false)}
                  className={({ isActive }) =>
                    `account-menu-item ${isActive ? "active" : ""}`
                  }
                >
                  <User size={16} />
                  Profil & Pengaturan
                </NavLink>

                <button
                  className="account-menu-item account-menu-item-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatRole(role = "") {
  // "petugas_registrasi" -> "Petugas Registrasi"
  return role
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default Header;