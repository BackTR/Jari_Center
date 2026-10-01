import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import logo from '../../assets/logo/jari_center.png'
import './Layout.css'


/* =====================================================
   NAVIGATION
   ===================================================== */

const PETUGAS_NAV_ITEMS = [
  {
    to: '/',
    label: 'Beranda',
    end: true,
    icon: <HomeIcon />,
  },
  {
    to: '/pasien/cari',
    label: 'Cari Pasien',
    end: true,
    icon: <SearchUserIcon />,
  },
  {
    to: '/pasien/baru',
    label: 'Daftarkan Pasien',
    end: true,
    icon: <UserPlusIcon />,
  },
  {
    to: '/kunjungan/baru',
    label: 'Daftarkan Kunjungan',
    end: true,
    icon: <CalendarPlusIcon />,
  },
  {
    to: '/antrian',
    label: 'Nomor Antrian',
    end: true,
    icon: <QueueIcon />,
  },
  {
    to: '/kunjungan',
    label: 'Kunjungan',
    end: true,
    icon: <VisitIcon />,
  },
]

const SUPER_ADMIN_NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    end: true,
    icon: <HomeIcon />,
  },
]


/* =====================================================
   LAYOUT
   ===================================================== */

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = user?.role === 'super_admin' ? SUPER_ADMIN_NAV_ITEMS : PETUGAS_NAV_ITEMS


  /* ===================================================
     TOGGLE SIDEBAR
     =================================================== */

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }


  /* ===================================================
     DATA FASILITAS DARI USER LOGIN
     =================================================== */

  const facilityName =
    user?.facility_name ||
    user?.facility?.name ||
    user?.facility?.nama ||
    'Fasilitas Kesehatan'


  /* ===================================================
     ROLE USER
     =================================================== */

  const userRole =
    user?.role
      ?.replaceAll('_', ' ')
      ?.replace(/\b\w/g, (char) => char.toUpperCase()) ||
    'Petugas'


  /* ===================================================
     NAMA USER
     =================================================== */

  const userName =
    user?.name ||
    'Pengguna'


  /* ===================================================
     LOGOUT
     =================================================== */

  function handleLogout() {
    logout?.()
    navigate('/login')
  }


  /* ===================================================
     RENDER
     =================================================== */

  return (
    <div
      className={`app-shell ${
        sidebarOpen
          ? 'sidebar-is-open'
          : 'sidebar-is-closed'
      }`}
    >

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="sidebar">

        {/* =================================================
            BRAND
            ================================================= */}

        <div className="sidebar-top">

          <div className="sidebar-brand">

            <div className="sidebar-brand-logo">

              <img
                src={logo}
                alt="Jari Center"
                className="sidebar-brand-logo-img"
              />

            </div>


            <div className="sidebar-brand-text">

              <div className="sidebar-brand-name">
                Jari<span>Center</span>
              </div>

              <div className="sidebar-brand-tag">
                Registrasi Faskes
              </div>

            </div>

          </div>


          {/* =================================================
              TOGGLE SIDEBAR
              ================================================= */}

          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen
                ? 'Tutup menu'
                : 'Buka menu'
            }
            title={
              sidebarOpen
                ? 'Tutup menu'
                : 'Buka menu'
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>


        <div className="sidebar-divider"></div>


        {/* =================================================
            NAVIGATION
            ================================================= */}

        <nav className="sidebar-nav">

          <div className="sidebar-section-label">
            MENU UTAMA
          </div>


          {navItems.map((item) => (

            <NavLink
              key={item.to}
              to={item.to}

              /*
               * Ini yang penting.
               *
               * React Router akan mencocokkan URL
               * secara exact untuk menu yang punya
               * end: true.
               */
              end={item.end}

              className={({ isActive }) =>
                `sidebar-link ${
                  isActive
                    ? 'sidebar-link--active'
                    : ''
                }`
              }
            >

              <span className="sidebar-link-icon">
                {item.icon}
              </span>


              <span className="sidebar-link-label">
                {item.label}
              </span>


              <span className="sidebar-link-arrow">
                <ArrowIcon />
              </span>

            </NavLink>

          ))}

        </nav>


        {/* =================================================
            SIDEBAR BOTTOM
            ================================================= */}

        <div className="sidebar-bottom">

          {/* =================================================
              STATUS SISTEM
              ================================================= */}

          <div className="sidebar-status">

            <div className="sidebar-status-dot"></div>


            <div className="sidebar-status-text">

              <strong>
                Sistem Aktif
              </strong>

              <span>
                Jari Center Online
              </span>

            </div>

          </div>


          {/* =================================================
              USER INFO
              ================================================= */}

          {user && (

            <div className="sidebar-user">

              <div className="sidebar-user-avatar">
                {userName
                  ?.charAt(0)
                  ?.toUpperCase() || 'U'}
              </div>


              <div className="sidebar-user-info">

                <div className="sidebar-user-name">
                  {userName}
                </div>

                <div className="sidebar-user-role">
                  {userRole}
                </div>

                <div className="sidebar-user-facility">
                  {facilityName}
                </div>

              </div>

            </div>

          )}


          {/* =================================================
              LOGOUT
              ================================================= */}

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >

            <LogoutIcon />

            <span>
              Keluar
            </span>

          </button>

        </div>

      </aside>


      {/* =================================================
          CONTENT
          ================================================= */}

      <main className="app-content">
        <Outlet />
      </main>

    </div>
  )
}


/* =====================================================
   ICON HOME
   ===================================================== */

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <path
        d="M3 10.8L12 3l9 7.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.5 9.5V20h13V9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M9.5 20v-5.8h5V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

    </svg>
  )
}


/* =====================================================
   ICON SEARCH USER
   ===================================================== */

function SearchUserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <circle
        cx="10.5"
        cy="8.5"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4.5 19c.7-3.2 2.7-5 6-5 2 0 3.5.6 4.6 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="17.2"
        cy="16.7"
        r="3.3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M19.7 19.2l2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

    </svg>
  )
}


/* =====================================================
   ICON USER PLUS
   ===================================================== */

function UserPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <circle
        cx="9"
        cy="8"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3.8 19c.6-3.2 2.5-5 5.2-5 2.8 0 4.7 1.8 5.3 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M17 8v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 11h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

    </svg>
  )
}


/* =====================================================
   ICON DAFTARKAN KUNJUNGAN
   ===================================================== */

function CalendarPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M7.5 3.5v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16.5 3.5v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M3.5 9h17"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 12v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M9.5 14.5h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

    </svg>
  )
}


/* =====================================================
   ICON NOMOR ANTRIAN
   ===================================================== */

function QueueIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <rect
        x="4"
        y="3.5"
        width="16"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 7.5h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 11.5h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 11.5h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 15.5h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 15.5h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

    </svg>
  )
}


/* =====================================================
   ICON KUNJUNGAN
   ===================================================== */

function VisitIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <rect
        x="4"
        y="3.5"
        width="16"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 7.5h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 11.5h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 15.5h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="16.5"
        cy="15.5"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

    </svg>
  )
}


/* =====================================================
   ICON ARROW
   ===================================================== */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

    </svg>
  )
}


/* =====================================================
   ICON LOGOUT
   ===================================================== */

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >

      <path
        d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

    </svg>
  )
}
