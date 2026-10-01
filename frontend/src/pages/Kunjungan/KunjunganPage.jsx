import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getVisits } from '../../api/visits.js'
import { getQueues } from '../../api/queues.js'
import { extractErrorMessage } from '../../utils/errors.js'
import { stageLabel } from '../../utils/stage.js'
import './KunjunganPage.css'


/* =========================================================
   ICONS
========================================================= */

function VisitIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="4"
        y="3.5"
        width="16"
        height="17"
        rx="2"
      />

      <path d="M8 7.5h8" />
      <path d="M8 11.5h8" />
      <path d="M8 15.5h4" />

      <circle
        cx="16.5"
        cy="15.5"
        r="2"
      />
    </svg>
  )
}


function SearchIcon({ size = 18 }) {
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
      <circle
        cx="10.8"
        cy="10.8"
        r="6.3"
      />

      <path d="m16 16 5 5" />
    </svg>
  )
}


function FilterIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  )
}


function UserIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />

      <path d="M5 20c.7-3.7 3-5.5 7-5.5s6.3 1.8 7 5.5" />
    </svg>
  )
}


function HospitalIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 21V6h16v15" />

      <path d="M8 6V3h8v3" />

      <path d="M9 10h6" />
      <path d="M12 7v6" />

      <path d="M8 17h2" />
      <path d="M14 17h2" />
      <path d="M8 21v-4" />
      <path d="M16 21v-4" />
    </svg>
  )
}


function QueueIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="4"
        y="3.5"
        width="16"
        height="17"
        rx="2"
      />

      <path d="M8 7.5h8" />

      <path d="M8 11.5h2" />
      <path d="M14 11.5h2" />

      <path d="M8 15.5h2" />
      <path d="M14 15.5h2" />
    </svg>
  )
}


function ClockIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
      />

      <path d="M12 7v5l3 2" />
    </svg>
  )
}


function CheckCircleIcon({ size = 17 }) {
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
      <circle
        cx="12"
        cy="12"
        r="8.5"
      />

      <path d="m8.5 12 2.3 2.3 4.7-5" />
    </svg>
  )
}


function ArrowRightIcon({ size = 17 }) {
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
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}


function CalendarIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />

      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}


/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = '') {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) {
    return 'P'
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase()
}


function getStatusKey(status) {
  switch (status) {
    case 'waiting_verification':
      return 'waiting'

    case 'verified':
      return 'registered'

    case 'cancelled':
      return 'cancelled'

    case 'completed':
      return 'completed'

    default:
      return status || 'unknown'
  }
}


function getStatusLabel(status) {
  if (!status) {
    return 'Tidak diketahui'
  }

  return stageLabel(status)
}


/* =========================================================
   NORMALIZE VISIT + QUEUE
========================================================= */

function normalizeVisit(visit, queues = []) {
  /*
   * Cari antrean yang benar-benar milik kunjungan ini.
   *
   * Prioritas:
   * 1. queue.visit_id === visit.id
   * 2. queue.patient_id === visit.patient.id
   *
   * Jadi nomor antrean tidak lagi bergantung pada
   * data dummy / data antrean yang berbeda.
   */

  const visitId = Number(visit.id)

  const patientId = visit.patient?.id
    ? Number(visit.patient.id)
    : null

  let matchedQueue = null

  /*
   * PRIORITAS 1
   * Cocokkan langsung berdasarkan visit_id.
   */
  if (visitId) {
    matchedQueue = queues.find(
      (queue) =>
        queue.visit_id !== null &&
        queue.visit_id !== undefined &&
        Number(queue.visit_id) === visitId
    )
  }

  /*
   * PRIORITAS 2
   * Kalau queue belum membawa visit_id,
   * cocokkan berdasarkan patient_id.
   */
  if (!matchedQueue && patientId) {
    matchedQueue = queues.find(
      (queue) =>
        queue.patient_id !== null &&
        queue.patient_id !== undefined &&
        Number(queue.patient_id) === patientId
    )
  }

  /*
   * Kalau VisitResource sudah menyediakan queue,
   * tetap gunakan sebagai fallback.
   */
  const queue =
    matchedQueue ||
    visit.queue ||
    null

  return {
    ...visit,

    patientName:
      visit.patient?.name ||
      'Pasien',

    patientJariId:
      visit.patient?.jari_id ||
      '—',

    polyclinic:
      visit.polyclinic_name ||
      visit.polyclinic?.name ||
      queue?.polyclinic?.name ||
      'Poliklinik',

    polyclinicCode:
      visit.polyclinic_code ||
      visit.polyclinic?.code ||
      queue?.polyclinic?.code ||
      '',

    queueNumber:
      queue?.queue_number ||
      '—',

    queueStatus:
      queue?.status ||
      null,

    queueCalledAt:
      queue?.called_at ||
      null,

    status:
      visit.status,

    statusLabel:
      getStatusLabel(visit.status),

    statusKey:
      getStatusKey(visit.status),
  }
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status, statusKey }) {
  const isCancelled =
    statusKey === 'cancelled'

  const isCompleted =
    statusKey === 'completed'

  const isRegistered =
    statusKey === 'registered'

  let icon = <ClockIcon size={14} />

  if (isRegistered || isCompleted) {
    icon = <CheckCircleIcon size={14} />
  }

  if (isCancelled) {
    icon = <span>×</span>
  }

  return (
    <span
      className={`visit-status visit-status--${statusKey}`}
    >
      <span className="visit-status-icon">
        {icon}
      </span>

      <span>
        {status}
      </span>
    </span>
  )
}


/* =========================================================
   COMPONENT
========================================================= */

export default function KunjunganPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [visits, setVisits] = useState([])

  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] =
    useState('all')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  /* =======================================================
     LOAD VISITS + QUEUES
  ======================================================= */

  async function loadVisits() {
    setLoading(true)
    setError('')

    try {
      const facilityId = user?.facility_id

      const [
        visitsResponse,
        queuesResponse,
      ] = await Promise.all([
        getVisits(facilityId),
        getQueues(facilityId),
      ])

      const visitRows =
        Array.isArray(visitsResponse?.data)
          ? visitsResponse.data
          : []

      const queueRows =
        Array.isArray(queuesResponse?.data)
          ? queuesResponse.data
          : []

      /*
       * Gabungkan visit dengan queue asli.
       */
      const normalizedVisits =
        visitRows.map((visit) =>
          normalizeVisit(
            visit,
            queueRows
          )
        )

      setVisits(normalizedVisits)

    } catch (err) {
      console.error(
        'Gagal mengambil data kunjungan dan antrean:',
        err
      )

      setError(
        extractErrorMessage(err)
      )
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadVisits()
  }, [])


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredVisits = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase()

    return visits.filter((visit) => {

      const matchesSearch =
        !keyword ||
        visit.patientName
          .toLowerCase()
          .includes(keyword) ||

        visit.patientJariId
          .toLowerCase()
          .includes(keyword) ||

        visit.queueNumber
          .toLowerCase()
          .includes(keyword) ||

        visit.polyclinic
          .toLowerCase()
          .includes(keyword)

      const matchesStatus =
        statusFilter === 'all' ||
        visit.statusKey === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })
  }, [
    visits,
    search,
    statusFilter,
  ])


  /* =======================================================
     STATISTIC
  ======================================================= */

  const totalVisits =
    visits.length

  const waitingVisits =
    visits.filter(
      (visit) =>
        visit.status ===
        'waiting_verification'
    ).length

  const registeredVisits =
    visits.filter(
      (visit) =>
        visit.status === 'verified'
    ).length


  /* =======================================================
     DETAIL
  ======================================================= */

  function handleDetail(visit) {
    navigate(
      `/kunjungan/${visit.id}`
    )
  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="kunjungan-page">

        <section className="kunjungan-card">

          <div className="kunjungan-loading">

            <div className="kunjungan-loading-spinner" />

            <strong>
              Memuat data kunjungan...
            </strong>

            <span>
              Mohon tunggu sebentar.
            </span>

          </div>

        </section>

      </div>
    )
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="kunjungan-page">

        <section className="kunjungan-card">

          <div className="kunjungan-error">

            <div className="kunjungan-error-icon">
              <ClockIcon size={24} />
            </div>

            <div>

              <h2>
                Data kunjungan tidak dapat dimuat
              </h2>

              <p>
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadVisits}
            >
              Coba Lagi
            </button>

          </div>

        </section>

      </div>
    )
  }


  return (
    <div className="kunjungan-page">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="kunjungan-page-header">

        <div className="kunjungan-header-left">

          <div className="kunjungan-header-icon">
            <VisitIcon size={25} />
          </div>

          <div>

            <div className="kunjungan-breadcrumb">
              Menu Utama
              <span>/</span>
              Kunjungan
            </div>

            <h1>
              Kunjungan
            </h1>

            <p>
              Daftar kunjungan pasien di fasilitas kesehatan.
            </p>

          </div>

        </div>

        <div className="kunjungan-header-date">

          <CalendarIcon size={16} />

          <span>
            Hari ini
          </span>

        </div>

      </div>


      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="kunjungan-summary">

        {/* TOTAL */}

        <div className="kunjungan-summary-card">

          <div className="summary-icon summary-icon--blue">
            <VisitIcon size={20} />
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Total Kunjungan
            </span>

            <strong>
              {totalVisits}
            </strong>

          </div>

        </div>


        {/* MENUNGGU */}

        <div className="kunjungan-summary-card">

          <div className="summary-icon summary-icon--orange">
            <ClockIcon size={20} />
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Menunggu Verifikasi
            </span>

            <strong>
              {waitingVisits}
            </strong>

          </div>

        </div>


        {/* TERDAFTAR */}

        <div className="kunjungan-summary-card">

          <div className="summary-icon summary-icon--green">
            <CheckCircleIcon size={20} />
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Terdaftar
            </span>

            <strong>
              {registeredVisits}
            </strong>

          </div>

        </div>

      </div>


      {/* ===================================================
          MAIN CARD
      =================================================== */}

      <section className="kunjungan-card">

        {/* HEADER */}

        <div className="kunjungan-card-header">

          <div>

            <h2>
              Daftar Kunjungan
            </h2>

            <p>
              Kelola dan lihat detail kunjungan pasien.
            </p>

          </div>

          <div className="kunjungan-card-total">

            <span>
              {filteredVisits.length}
            </span>

            <small>
              kunjungan
            </small>

          </div>

        </div>


        {/* FILTER */}

        <div className="kunjungan-filter">

          <div className="kunjungan-search">

            <span className="kunjungan-search-icon">
              <SearchIcon size={18} />
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Cari nama pasien, Jari ID, poli, atau nomor antrean..."
            />

            {search && (
              <button
                type="button"
                className="kunjungan-search-clear"
                onClick={() =>
                  setSearch('')
                }
                aria-label="Hapus pencarian"
              >
                ×
              </button>
            )}

          </div>


          <div className="kunjungan-status-filter">

            <span className="filter-icon">
              <FilterIcon size={17} />
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                Semua Status
              </option>

              <option value="waiting">
                Menunggu Verifikasi
              </option>

              <option value="registered">
                Terdaftar
              </option>

              <option value="completed">
                Selesai
              </option>

              <option value="cancelled">
                Dibatalkan
              </option>

            </select>

          </div>

        </div>


        {/* TABLE */}

        <div className="kunjungan-table-wrapper">

          <table className="kunjungan-table">

            <thead>

              <tr>

                <th className="column-number">
                  No
                </th>

                <th>
                  Pasien
                </th>

                <th>
                  Poli
                </th>

                <th>
                  Antrean
                </th>

                <th>
                  Status
                </th>

                <th className="column-action">
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredVisits.length > 0 ? (

                filteredVisits.map(
                  (visit, index) => (

                    <tr
                      key={visit.id}
                    >

                      {/* NO */}

                      <td className="column-number">

                        <span className="visit-row-number">
                          {index + 1}
                        </span>

                      </td>


                      {/* PASIEN */}

                      <td>

                        <div className="visit-patient">

                          <div className="visit-patient-avatar">
                            {getInitials(
                              visit.patientName
                            )}
                          </div>

                          <div className="visit-patient-info">

                            <strong>
                              {visit.patientName}
                            </strong>

                            <span>
                              <UserIcon size={13} />
                              {visit.patientJariId}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* POLI */}

                      <td>

                        <div className="visit-poly">

                          <span className="visit-poly-icon">
                            <HospitalIcon size={16} />
                          </span>

                          <div>

                            <strong>
                              {visit.polyclinic}
                            </strong>

                          </div>

                        </div>

                      </td>


                      {/* ANTREAN */}

                      <td>

                        <div className="visit-queue">

                          <span className="visit-queue-icon">
                            <QueueIcon size={16} />
                          </span>

                          <strong>
                            {visit.queueNumber}
                          </strong>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td>

                        <StatusBadge
                          status={
                            visit.statusLabel
                          }
                          statusKey={
                            visit.statusKey
                          }
                        />

                      </td>


                      {/* AKSI */}

                      <td className="column-action">

                        <button
                          type="button"
                          className="visit-detail-button"
                          onClick={() =>
                            handleDetail(
                              visit
                            )
                          }
                        >

                          <span>
                            Detail
                          </span>

                          <ArrowRightIcon size={16} />

                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="visit-empty-cell"
                  >

                    <div className="visit-empty">

                      <div className="visit-empty-icon">
                        <SearchIcon size={25} />
                      </div>

                      <strong>
                        Kunjungan tidak ditemukan
                      </strong>

                      <span>
                        Tidak ada kunjungan yang sesuai
                        dengan pencarian atau filter.
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSearch('')
                          setStatusFilter('all')
                        }}
                      >
                        Reset Pencarian
                      </button>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div className="kunjungan-card-footer">

          <div className="kunjungan-footer-info">

            <span className="footer-info-icon">
              <CheckCircleIcon size={15} />
            </span>

            <span>
              Data kunjungan ditampilkan berdasarkan
              fasilitas kesehatan yang sedang aktif.
            </span>

          </div>

          <span className="kunjungan-footer-count">
            Menampilkan {filteredVisits.length} dari {totalVisits} kunjungan
          </span>

        </div>

      </section>

    </div>
  )
}