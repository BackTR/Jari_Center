import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getQueues } from '../../api/queues.js'
import { getVisits } from '../../api/visits.js'
import logo from '../../assets/logo/jari_center.png'
import './Dashboard.css'

/* =========================================================
   ICON
   ========================================================= */

const Icon = ({ name, size = 22 }) => {
  const icons = {
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.6-3.3 2.5-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
        <path d="M16 11a3 3 0 1 0 0-6" />
        <path d="M17 15c2.1.3 3.4 1.8 3.8 4" />
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

    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
        <path d="M12 13v4" />
        <path d="M10 15h4" />
      </>
    ),

    queue: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    calendarCheck: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
        <path d="m9 15 2 2 4-4" />
      </>
    ),
  }

  return (
    <svg
      className="dashboard-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}


/* =========================================================
   QUICK ACTION
   ========================================================= */

const QUICK_ACTIONS = [
  {
    to: '/pasien/cari',
    title: 'Cari Pasien',
    desc: 'Cari berdasarkan Jari ID, NIK, atau nama.',
    icon: 'search',
    color: 'blue',
  },
  {
    to: '/pasien/baru',
    title: 'Daftarkan Pasien',
    desc: 'Tambah pasien baru ke dalam sistem.',
    icon: 'userPlus',
    color: 'green',
  },
  {
    to: '/kunjungan/baru',
    title: 'Daftarkan Kunjungan',
    desc: 'Buat kunjungan baru untuk pasien.',
    icon: 'calendar',
    color: 'cyan',
  },
  {
    to: '/antrian',
    title: 'Nomor Antrian',
    desc: 'Lihat dan kelola antrean pelayanan.',
    icon: 'queue',
    color: 'purple',
  },
]


/* =========================================================
   HELPER
   ========================================================= */

const extractArray = (response) => {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response)) {
    return response
  }

  return []
}


/**
 * Menentukan status efektif antrean.
 *
 * Status kunjungan menjadi sumber utama untuk proses pelayanan.
 * Status queue dipakai sebagai fallback.
 */
const getEffectiveQueueStatus = (queue, visit) => {
  const visitStatus = String(
    visit?.status || ''
  ).toLowerCase()

  const queueStatus = String(
    queue?.status || ''
  ).toLowerCase()

  if (visitStatus === 'completed') {
    return 'done'
  }

  if (visitStatus === 'cancelled') {
    return 'cancelled'
  }

  if (visitStatus === 'in_service') {
    return 'in_service'
  }

  if (visitStatus === 'waiting_verification') {
    return 'waiting_verification'
  }

  if (queueStatus === 'done') {
    return 'done'
  }

  if (queueStatus === 'skipped') {
    return 'skipped'
  }

  if (queueStatus === 'in_service') {
    return 'in_service'
  }

  if (queueStatus === 'called') {
    return 'called'
  }

  return 'waiting'
}


const formatTime = (value) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}


const isToday = (value) => {
  if (!value) {
    return false
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const now = new Date()

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}


const makeQueueKey = (patientId, queueNumber) => {
  if (!patientId || !queueNumber) {
    return null
  }

  return `${patientId}::${queueNumber}`
}


/* =========================================================
   DASHBOARD
   ========================================================= */

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [currentTime, setCurrentTime] = useState(new Date())

  const [visits, setVisits] = useState([])
  const [queues, setQueues] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  /* =======================================================
     REALTIME CLOCK
     ======================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])


  /* =======================================================
     LOAD DASHBOARD DATA
     ======================================================= */

  const loadDashboardData = async () => {
    try {
      setError('')

      const facilityId = user?.facility_id

      const [visitsResponse, queuesResponse] = await Promise.all([
        getVisits(facilityId),
        getQueues(facilityId),
      ])

      const visitsData = extractArray(visitsResponse)
      const queuesData = extractArray(queuesResponse)

      setVisits(visitsData)
      setQueues(queuesData)
    } catch (err) {
      console.error(
        'Gagal mengambil data dashboard:',
        err
      )

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Gagal mengambil data dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }


  /* =======================================================
     INITIAL LOAD + AUTO REFRESH 30 DETIK
     ======================================================= */

  useEffect(() => {
    loadDashboardData()

    const refreshTimer = setInterval(() => {
      loadDashboardData()
    }, 30000)

    return () => {
      clearInterval(refreshTimer)
    }
  }, [])


  /* =======================================================
     USER DATA
     ======================================================= */

  const facilityName =
    user?.facility_name ||
    user?.facility?.name ||
    'Fasilitas Kesehatan'

  const userName =
    user?.name ||
    'Petugas'


  /* =======================================================
     TODAY VISITS
     ======================================================= */

  const todayVisits = useMemo(() => {
    return visits.filter((visit) => {
      return isToday(visit?.created_at)
    })
  }, [visits])


  /* =======================================================
     VISIT MAP
     ======================================================= */

  const visitByQueueKey = useMemo(() => {
    const map = new Map()

    visits.forEach((visit) => {
      const patientId = visit?.patient?.id
      const queueNumber = visit?.queue?.queue_number

      const key = makeQueueKey(
        patientId,
        queueNumber
      )

      if (key) {
        map.set(key, visit)
      }
    })

    return map
  }, [visits])


  /* =======================================================
     ENRICH QUEUE DATA
     ======================================================= */

  const enrichedQueues = useMemo(() => {
    return queues
      .map((queue) => {
        const patientId = queue?.patient?.id
        const queueNumber = queue?.queue_number

        const key = makeQueueKey(
          patientId,
          queueNumber
        )

        const matchedVisit = key
          ? visitByQueueKey.get(key)
          : null

        const effectiveStatus =
          getEffectiveQueueStatus(
            queue,
            matchedVisit
          )

        return {
          ...queue,
          visit: matchedVisit,
          effectiveStatus,
        }
      })
      .filter((queue) => {
        return (
          !queue?.queue_date ||
          isToday(queue.queue_date)
        )
      })
  }, [queues, visitByQueueKey])


  /* =======================================================
     STATISTICS
     ======================================================= */

  const patientCount = useMemo(() => {
    const uniquePatients = new Set()

    todayVisits.forEach((visit) => {
      if (visit?.patient?.id) {
        uniquePatients.add(
          visit.patient.id
        )
      }
    })

    return uniquePatients.size
  }, [todayVisits])


  const completedCount = useMemo(() => {
    return todayVisits.filter((visit) => {
      return (
        String(
          visit?.status || ''
        ).toLowerCase() === 'completed'
      )
    }).length
  }, [todayVisits])


  const waitingCount = useMemo(() => {
    return enrichedQueues.filter((queue) => {
      return (
        queue.effectiveStatus === 'waiting' ||
        queue.effectiveStatus === 'waiting_verification'
      )
    }).length
  }, [enrichedQueues])


  const visitCount = todayVisits.length


  /* =======================================================
     CURRENT QUEUE
     ======================================================= */

  const currentQueue = useMemo(() => {
    const activeQueues =
      enrichedQueues.filter((queue) => {
        return (
          queue.effectiveStatus ===
          'in_service'
        )
      })

    if (!activeQueues.length) {
      return null
    }

    return [...activeQueues].sort((a, b) => {
      const aTime = a?.called_at
        ? new Date(
            a.called_at
          ).getTime()
        : 0

      const bTime = b?.called_at
        ? new Date(
            b.called_at
          ).getTime()
        : 0

      return bTime - aTime
    })[0]
  }, [enrichedQueues])


  /* =======================================================
     CURRENT QUEUE DATA
     ======================================================= */

  const currentQueueNumber =
    currentQueue?.queue_number ||
    '—'

  const currentQueuePatient =
    currentQueue?.patient?.name ||
    currentQueue?.visit?.patient?.name ||
    'Belum ada antrean'

  const currentQueuePolyclinic =
    currentQueue?.polyclinic?.name ||
    currentQueue?.visit?.polyclinic?.name ||
    currentQueue?.visit?.polyclinic_name ||
    'Pelayanan'


  /* =======================================================
     RECENT ACTIVITIES
     ======================================================= */

  const activities = useMemo(() => {
    const activityItems = []


    /* -----------------------------------------------
       Aktivitas kunjungan
       ----------------------------------------------- */

    todayVisits.forEach((visit) => {
      const status = String(
        visit?.status || ''
      ).toLowerCase()

      const patientName =
        visit?.patient?.name ||
        'Pasien'

      let title =
        'Kunjungan berhasil didaftarkan'

      let icon = 'calendarCheck'
      let color = 'green'

      if (status === 'completed') {
        title =
          'Kunjungan selesai diproses'

        icon = 'check'
        color = 'green'
      } else if (
        status === 'in_service'
      ) {
        title =
          'Pasien sedang dilayani'

        icon = 'clock'
        color = 'cyan'
      } else if (
        status === 'verified'
      ) {
        title =
          'Data pasien berhasil diverifikasi'

        icon = 'users'
        color = 'blue'
      } else if (
        status === 'cancelled'
      ) {
        title =
          'Kunjungan dibatalkan'

        icon = 'calendar'
        color = 'purple'
      }

      activityItems.push({
        id: `visit-${visit.id}`,
        title,
        description:
          `Pasien ${patientName}`,
        time: visit?.created_at,
        icon,
        color,
      })
    })


    /* -----------------------------------------------
       Aktivitas antrean dipanggil
       ----------------------------------------------- */

    enrichedQueues.forEach((queue) => {
      if (!queue?.called_at) {
        return
      }

      const queueNumber =
        queue?.queue_number ||
        '—'

      const patientName =
        queue?.patient?.name ||
        queue?.visit?.patient?.name ||
        'Pasien'

      activityItems.push({
        id: `queue-${queue.id}`,
        title:
          'Nomor antrean dipanggil',
        description:
          `${queueNumber} · ${patientName}`,
        time: queue.called_at,
        icon: 'queue',
        color: 'cyan',
      })
    })


    return activityItems
      .filter((item) => item.time)
      .sort((a, b) => {
        const aTime =
          new Date(a.time).getTime()

        const bTime =
          new Date(b.time).getTime()

        return bTime - aTime
      })
      .slice(0, 4)
  }, [
    todayVisits,
    enrichedQueues,
  ])


  /* =======================================================
     FORMATTED TIME
     ======================================================= */

  const formattedTime =
    currentTime.toLocaleTimeString(
      'id-ID',
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
    )


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="dashboard-page">

      {/* ===================================================
          WELCOME HEADER
          =================================================== */}

      <section className="dashboard-welcome">

        <div className="welcome-left">

          <div className="welcome-logo">
            <img
              src={logo}
              alt="Jari Center"
            />
          </div>

          <div className="welcome-text">

            <span className="welcome-label">
              DASHBOARD PELAYANAN
            </span>

            <h1>
              Selamat datang, {userName}
            </h1>

            <p>
              Kelola pelayanan pasien di{' '}
              <strong>
                {facilityName}
              </strong>.
            </p>

          </div>

        </div>


        <div className="welcome-right">

          <div className="online-status">

            <span className="online-dot" />

            <div>
              <strong>
                Sistem Online
              </strong>

              <span>
                Data tersinkron otomatis
              </span>
            </div>

          </div>


          <div className="current-time">

            <Icon
              name="clock"
              size={15}
            />

            <span>
              {formattedTime} WIB
            </span>

          </div>

        </div>

      </section>


      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div
          style={{
            marginBottom: '18px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#fff4f4',
            border: '1px solid #ffd4d4',
            color: '#b42318',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}


      {/* ===================================================
          STATISTICS
          =================================================== */}

      <section className="dashboard-stats">

        {/* PASIEN */}

        <div className="stat-card">

          <div className="stat-icon blue">
            <Icon
              name="users"
              size={21}
            />
          </div>

          <div className="stat-content">

            <span>
              Pasien Hari Ini
            </span>

            <strong>
              {loading
                ? '—'
                : patientCount}
            </strong>

            <small>
              Pasien terdaftar
            </small>

          </div>

        </div>


        {/* SELESAI */}

        <div className="stat-card">

          <div className="stat-icon green">
            <Icon
              name="check"
              size={21}
            />
          </div>

          <div className="stat-content">

            <span>
              Sudah Dilayani
            </span>

            <strong>
              {loading
                ? '—'
                : completedCount}
            </strong>

            <small>
              Pelayanan selesai
            </small>

          </div>

        </div>


        {/* MENUNGGU */}

        <div className="stat-card">

          <div className="stat-icon orange">
            <Icon
              name="clock"
              size={21}
            />
          </div>

          <div className="stat-content">

            <span>
              Menunggu
            </span>

            <strong>
              {loading
                ? '—'
                : waitingCount}
            </strong>

            <small>
              Pasien dalam antrean
            </small>

          </div>

        </div>


        {/* KUNJUNGAN */}

        <div className="stat-card">

          <div className="stat-icon purple">
            <Icon
              name="queue"
              size={21}
            />
          </div>

          <div className="stat-content">

            <span>
              Kunjungan
            </span>

            <strong>
              {loading
                ? '—'
                : visitCount}
            </strong>

            <small>
              Total hari ini
            </small>

          </div>

        </div>

      </section>


      {/* ===================================================
          MAIN GRID
          =================================================== */}

      <div className="dashboard-grid">

        {/* =================================================
            MULAI PELAYANAN
            ================================================= */}

        <section className="dashboard-card quick-card">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                AKSES CEPAT
              </span>

              <h2>
                Mulai Pelayanan
              </h2>
            </div>

          </div>


          <div className="quick-grid">

            {QUICK_ACTIONS.map((action) => (

              <button
                key={action.to}
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate(action.to)
                }
              >

                <div
                  className={`quick-icon ${action.color}`}
                >
                  <Icon
                    name={action.icon}
                    size={21}
                  />
                </div>


                <div className="quick-action-text">

                  <h3>
                    {action.title}
                  </h3>

                  <p>
                    {action.desc}
                  </p>

                </div>


                <Icon
                  name="arrow"
                  size={16}
                />

              </button>

            ))}

          </div>

        </section>


        {/* =================================================
            ANTREAN SAAT INI
            ================================================= */}

        <section className="dashboard-card queue-card">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                ANTREAN
              </span>

              <h2>
                Antrean Saat Ini
              </h2>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                navigate('/antrian')
              }
            >
              Lihat semua

              <Icon
                name="arrow"
                size={14}
              />
            </button>

          </div>


          <div className="queue-main">

            <div className="queue-number">
              {loading
                ? '—'
                : currentQueueNumber}
            </div>

            <div className="queue-info">

              <span>
                Nomor sedang dilayani
              </span>

              <strong>
                {loading
                  ? 'Memuat data...'
                  : currentQueue
                    ? currentQueuePatient
                    : 'Belum ada antrean'}
              </strong>

              {!loading &&
                currentQueue && (
                  <small>
                    {currentQueuePolyclinic}
                  </small>
                )}

            </div>

          </div>


          <div className="queue-summary">

            <div>
              <span>
                Menunggu
              </span>

              <strong>
                {loading
                  ? '—'
                  : `${waitingCount} pasien`}
              </strong>
            </div>

            <div>
              <span>
                Selesai
              </span>

              <strong>
                {loading
                  ? '—'
                  : `${completedCount} pasien`}
              </strong>
            </div>

          </div>

        </section>


        {/* =================================================
            AKTIVITAS TERBARU
            ================================================= */}

        <section className="dashboard-card activity-card">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                AKTIVITAS
              </span>

              <h2>
                Aktivitas Terbaru
              </h2>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                navigate('/kunjungan')
              }
            >
              Lihat semua

              <Icon
                name="arrow"
                size={14}
              />
            </button>

          </div>


          <div className="activity-list">

            {loading ? (

              <div
                style={{
                  padding: '20px 0',
                  textAlign: 'center',
                  color: '#7b8794',
                  fontSize: '14px',
                }}
              >
                Memuat aktivitas...
              </div>

            ) : activities.length === 0 ? (

              <div
                style={{
                  padding: '20px 0',
                  textAlign: 'center',
                  color: '#7b8794',
                  fontSize: '14px',
                }}
              >
                Belum ada aktivitas hari ini.
              </div>

            ) : (

              activities.map(
                (activity) => (

                  <div
                    className="activity-item"
                    key={activity.id}
                  >

                    <div
                      className={`activity-icon ${activity.color}`}
                    >
                      <Icon
                        name={activity.icon}
                        size={18}
                      />
                    </div>

                    <div className="activity-content">

                      <strong>
                        {activity.title}
                      </strong>

                      <span>
                        {activity.description}
                      </span>

                    </div>

                    <time>
                      {formatTime(
                        activity.time
                      )}{' '}
                      WIB
                    </time>

                  </div>

                )
              )

            )}

          </div>

        </section>

      </div>

    </div>
  )
}