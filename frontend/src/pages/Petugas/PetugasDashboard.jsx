import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { extractErrorMessage } from '../../utils/errors.js'
import StatCard from '../../components/StatCard/StatCard.jsx'
import { getFacilityDashboard } from '../../api/facilities.js'
import { getQueues } from '../../api/queues.js'
import { getVisits } from '../../api/visits.js'
import { Icon } from '../../components/icons.jsx'
import './PetugasDashboard.css'

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
        getFacilityDashboard(facilityId),
        getQueues(facilityId),
        getVisits(facilityId),
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
            value={queues.filter(q => !['completed', 'cancelled'].includes(q.visit_status)).length}
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
                  <span className={`petugas-visit-status petugas-visit-status--${queue.visit_status}`}>
                    {queue.visit_status}
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
