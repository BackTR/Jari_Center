import { NavLink, Link } from "react-router-dom";
import {
  Fingerprint,
  LayoutDashboard,
  Users,
  ClipboardList,
  CalendarDays,
  FileText,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Pasien", path: "/patients", icon: Users },
  { name: "Pemeriksaan", path: "/examinations", icon: ClipboardList },
  { name: "Jadwal", path: "/schedule", icon: CalendarDays },
  { name: "Laporan", path: "/reports", icon: FileText },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* LOGO */}
    <Link to="/" className="sidebar-logo">
  <img
    src="/Jari Center.jpg"
    alt="Jari_Center"
    className="sidebar-logo-image"
  />
        <span className="sidebar-logo-text">
          <strong>
            JARI <span className="sidebar-logo-accent"> CENTER </span>
          </strong>
        </span>
      </Link>

      {/* MENU */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER USER */}
      <div className="sidebar-footer">
        <div className="user-avatar">A</div>
        <div>
          <strong>Admin</strong>
          <span>Administrator</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
