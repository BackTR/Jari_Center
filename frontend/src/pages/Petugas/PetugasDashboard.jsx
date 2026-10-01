import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { extractErrorMessage } from '../../utils/errors.js'
import StatCard from '../../components/StatCard/StatCard.jsx'
import api from '../../api/axios'
import './PetugasDashboard.css'

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
    queue: (
      <>
        <rect x="4" y="3.5" width="16" height="17" rx="2" />
        <path d="M8 7.5h8" />
        <path d="M8 11.5h2" />
        <path d="M14 11.5h2" />
        <path d="M8 15.5h2" />
        <path d="M14 15.5h2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    userPlus: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c.6-3.3 2.5-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
        <path d="M18 9v6" />
        <path d="M15 12h6" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
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

export default function PetugasDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  const [queues, setQueues] = useState([])
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const facilityId = user?.facility_id

  const loadData = async () => {
    if (!facilityId) {
      setLoading(false)
      setError('Akun ini tidak tertaut ke faskes. Hubungi admin.')
      return
    }

    try {
      setError('')

      const [statsRes, queuesRes, visitsRes] = await Promise.all([
        api.get(`/facilities/${facilityId}/dashboard`),
        api.get(`/facilities/${facilityId}/queues`),
        api.get('/visits', { params: { facility_id: facilityId } }),
      ])

      setStats(statsRes.data?.data ?? null)
      setQueues(queuesRes.data?.data ?? [])
      setVisits(visitsRes.data?.data ?? [])
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [facilityId])

  const quickActions = [
    {
      icon: <Icon name="search" size={24} />,
      label: 'Cari Pasien',
      onClick: () => navigate('/pasien/cari'),
      color: 'blue',
    },
    {
      icon: <Icon name="userPlus" size={24} />,
      label: 'Daftarkan Pasien',
      onClick: () => navigate('/pasien/baru'),
      color: 'green',
    },
    {
      icon: <Icon name="calendar" size={24} />,
      label: 'Daftarkan Kunjungan',
      onClick: () => navigate('/kunjungan/baru'),
      color: 'cyan',
    },
    {
      icon: <Icon name="queue" size={24} />,
      label: 'Nomor Antrian',
      onClick: () => navigate('/antrian'),
      color: 'purple',
    },
  ]

  if (loading) {
    return (
      <div className="petugas-page">
        <div className="petugas-loading">
          <div className="petugas-loading-spinner" />
          <strong>Memuat data...</strong>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="petugas-page">
        <div className="petugas-error">
          <strong>Error</strong>
          <p>{error}</p>
          <button onClick={loadData}>Coba Lagi</button>
        </div>
      </div>
    )
  }

  return (
    <div className="petugas-page">
      <div className="petugas-header">
        <div>
          <h1>Petugas Registrasi Dashboard</h1>
          <p>Selamat datang, {user?.name || 'Petugas'}</p>
        </div>
      </div>

      {stats && (
        <div className="petugas-stats">
          <StatCard
            icon={<Icon name="users" />}
            label="Pasien Baru Hari Ini"
            value={stats.by_status?.pending_verification || 0}
            color="blue"
          />
          <StatCard
            icon={<Icon name="calendar" />}
            label="Kunjungan Hari Ini"
            value={stats.total_visits_today || 0}
            color="green"
          />
          <StatCard
            icon={<Icon name="queue" />}
            label="Antrean Menunggu"
            value={queues.filter(q => q.status === 'waiting').length}
            color="orange"
          />
          <StatCard
            icon={<Icon name="check" />}
            label="Kunjungan Selesai"
            value={stats.by_status?.completed || 0}
            color="purple"
          />
        </div>
      )}

      <div className="petugas-quick-actions">
        <h2>Quick Actions</h2>
        <div className="petugas-quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className={`petugas-quick-action petugas-quick-action--${action.color}`}
              onClick={action.onClick}
            >
              <div className="petugas-quick-action-icon">
                {action.icon}
              </div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="petugas-grid">
        <div className="petugas-card">
          <div className="petugas-card-header">
            <h2>Antrean Saat Ini</h2>
            <button
              className="petugas-btn petugas-btn--primary"
              onClick={() => navigate('/antrian')}
            >
              Lihat Semua
            </button>
          </div>
          <div className="petugas-queue-list">
            {queues.length > 0 ? (
              queues.slice(0, 5).map((queue) => (
                <div key={queue.id} className="petugas-queue-item">
                  <div className="petugas-queue-number">{queue.queue_number}</div>
                  <div className="petugas-queue-info">
                    <strong>{queue.patient?.name || 'Pasien'}</strong>
                    <span>{queue.polyclinic || 'Umum'}</span>
                  </div>
                  <span className={`petugas-queue-status petugas-queue-status--${queue.status}`}>
                    {queue.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="petugas-empty">Belum ada antrean</div>
            )}
          </div>
        </div>

        <div className="petugas-card">
          <div className="petugas-card-header">
            <h2>Kunjungan Terbaru</h2>
            <button
              className="petugas-btn petugas-btn--primary"
              onClick={() => navigate('/kunjungan')}
            >
              Lihat Semua
            </button>
          </div>
          <div className="petugas-visit-list">
            {visits.length > 0 ? (
              visits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="petugas-visit-item">
                  <div className="petugas-visit-info">
                    <strong>{visit.patient?.name || 'Pasien'}</strong>
                    <span>{visit.patient?.jari_id || '-'}</span>
                  </div>
                  <span className={`petugas-visit-status petugas-visit-status--${visit.status}`}>
                    {visit.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="petugas-empty">Belum ada kunjungan</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
