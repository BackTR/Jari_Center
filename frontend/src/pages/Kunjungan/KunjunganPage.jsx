import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getVisits } from '../../api/visits.js'
import { getQueues } from '../../api/queues.js'
import { extractErrorMessage } from '../../utils/errors.js'
import { stageLabel } from '../../utils/stage.js'
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FilterIcon,
  HospitalIcon,
  QueueIcon,
  SearchIcon,
  UserIcon,
  VisitIcon,
} from '../../components/icons.jsx'
import './KunjunganPage.css'


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
    case 'pending_verification':
      return 'waiting'

    case 'verified':
      return 'verified'

    case 'registered':
      return 'registered'

    case 'in_service':
      return 'in_service'

    case 'completed':
      return 'completed'

    case 'cancelled':
      return 'cancelled'

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
  const visitId = Number(visit.id)

  const matchedQueue = queues.find(
    (queue) => queue.visit_id != null && Number(queue.visit_id) === visitId
  )

  const queue = matchedQueue || visit.queue || null

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

              <option value="verified">
                Terverifikasi
              </option>

              <option value="registered">
                Terdaftar
              </option>

              <option value="in_service">
                Sedang Dilayani
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