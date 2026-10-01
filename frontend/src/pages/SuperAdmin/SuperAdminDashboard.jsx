import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { extractErrorMessage } from '../../utils/errors.js'
import StatCard from '../../components/StatCard/StatCard.jsx'
import DataTable from '../../components/DataTable/DataTable.jsx'
import api from '../../api/axios'
import './SuperAdminDashboard.css'

const Icon = ({ name, size = 24 }) => {
  const icons = {
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.6-3.3 2.5-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
        <path d="M16 11a3 3 0 1 0 0-6" />
        <path d="M17 15c2.1.3 3.4 1.8 3.8 4" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
      </>
    ),
    hospital: (
      <>
        <path d="M4 21V6h16v15" />
        <path d="M8 6V3h8v3" />
        <path d="M9 10h6" />
        <path d="M12 7v6" />
      </>
    ),
    activity: (
      <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  )
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [facilities, setFacilities] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setError('')

      const [statsRes, facilitiesRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/facilities'),
        api.get('/admin/users'),
      ])

      setStats(statsRes.data?.data ?? null)
      setFacilities(facilitiesRes.data?.data ?? [])
      setUsers(usersRes.data?.data ?? [])
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const facilityColumns = [
    { key: 'name', label: 'Nama Faskes' },
    { key: 'type', label: 'Tipe', render: (row) => row.type },
    { key: 'code', label: 'Kode' },
    { key: 'users_count', label: 'User' },
    { key: 'visits_count', label: 'Kunjungan' },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
          {row.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ]

  const userColumns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => row.role },
    { key: 'facility_name', label: 'Faskes' },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
          {row.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="superadmin-page">
        <div className="superadmin-loading">
          <div className="superadmin-loading-spinner" />
          <strong>Memuat data...</strong>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="superadmin-page">
        <div className="superadmin-error">
          <strong>Error</strong>
          <p>{error}</p>
          <button onClick={loadData}>Coba Lagi</button>
        </div>
      </div>
    )
  }

  return (
    <div className="superadmin-page">
      <div className="superadmin-header">
        <div>
          <h1>Super Admin Dashboard</h1>
          <p>Monitoring dan manajemen sistem Jari Center</p>
        </div>
      </div>

      {stats && (
        <div className="superadmin-stats">
          <StatCard
            icon={<Icon name="users" />}
            label="Total Pasien"
            value={stats.total_patients}
            color="blue"
          />
          <StatCard
            icon={<Icon name="calendar" />}
            label="Kunjungan Hari Ini"
            value={stats.total_visits_today}
            color="green"
          />
          <StatCard
            icon={<Icon name="hospital" />}
            label="Faskes Aktif"
            value={stats.total_facilities}
            color="orange"
          />
          <StatCard
            icon={<Icon name="activity" />}
            label="User Aktif"
            value={stats.total_users}
            color="purple"
          />
        </div>
      )}

      <div className="superadmin-grid">
        <div className="superadmin-card">
          <div className="superadmin-card-header">
            <h2>Daftar Faskes</h2>
          </div>
          <DataTable columns={facilityColumns} data={facilities} />
        </div>

        <div className="superadmin-card">
          <div className="superadmin-card-header">
            <h2>Daftar User</h2>
          </div>
          <DataTable columns={userColumns} data={users} />
        </div>
      </div>
    </div>
  )
}
