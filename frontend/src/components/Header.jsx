import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";

// Isi menu dropdown akun. Kalau halamannya belum dibuat, path masih "#" —
// tinggal diganti ke path aslinya begitu page-nya sudah ada.
const accountMenuItems = [
  { label: "Menu Utama", path: "/", icon: LayoutDashboard },
  { label: "Registrasi Pasien", path: "#", icon: UserPlus },
  { label: "Data Pasien", path: "/patients", icon: Users },
  { label: "Rekam Medis", path: "#", icon: ClipboardList },
  { label: "IGD", path: "#", icon: Siren },
  { label: "Antrian", path: "#", icon: CalendarDays },
  { label: "Billing", path: "#", icon: Receipt },
  { label: "Laboratorium", path: "#", icon: FlaskConical },
  { label: "Farmasi", path: "#", icon: Pill },
  { label: "Laporan", path: "/reports", icon: FileText },
  { label: "Pengaturan", path: "#", icon: Settings },
];

function Header({
  petugas = { nama: "Andi Pratama", role: "Petugas Pendaftaran" },
  unit = { nama: "RS Sehat Abadi", role: "Unit Pendaftaran" },
  syncTime = "09:24:31 WIB",
  notifCount = 3,
  userInitials = "AP",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Tutup dropdown kalau klik di luar area menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <strong>{petugas.nama}</strong>
            <span>{petugas.role}</span>
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

        <button className="app-header-icon-btn" aria-label="Notifikasi">
          <Bell size={20} />
          {notifCount > 0 && (
            <span className="app-header-badge">{notifCount}</span>
          )}
        </button>

        {/* ===== TOMBOL MENU (dropdown) ===== */}
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
                  src="/Jari Center.jpg"
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
                        `account-menu-item ${
                          isActive && item.path !== "#" ? "active" : ""
                        }`
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

        {/* ===== TOMBOL AVATAR (biasa, tanpa dropdown) ===== */}
        <button className="app-header-avatar-btn">
          <span className="app-header-avatar">{userInitials}</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

export default Header;