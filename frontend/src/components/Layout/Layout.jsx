import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import logo from '../../assets/logo/jari_center.png'
import {
  CalendarPlusIcon,
  ChevronRightIcon,
  HomeIcon,
  LogoutIcon,
  QueueIcon,
  SearchUserIcon,
  UserPlusIcon,
  VisitIcon,
} from '../icons.jsx'
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
                <ChevronRightIcon />
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

