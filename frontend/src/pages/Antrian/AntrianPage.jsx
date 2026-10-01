import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

import { getQueues } from '../../api/queues.js'
import { getVisits } from '../../api/visits.js'
import { extractErrorMessage } from '../../utils/errors.js'

import './AntrianPage.css'


/* =========================================================
   ICONS
========================================================= */

function QueueIcon({ size = 22 }) {
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


function RefreshIcon({ size = 17 }) {
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
      <path d="M20 11a8 8 0 0 0-14.9-4" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 4" />
      <path d="M20 20v-5h-5" />
    </svg>
  )
}


function ClockIcon({ size = 18 }) {
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

      <path d="M12 7v5l3 2" />
    </svg>
  )
}


function CheckIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
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


function SkipIcon({ size = 18 }) {
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

      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </svg>
  )
}


function HospitalIcon({ size = 17 }) {
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


function UserIcon({ size = 14 }) {
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


function formatDateIndonesia(date = new Date()) {
  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(date)
}


function normalizeStatus(visitStatus, queueStatus) {
  /*
   * PRIORITAS:
   * status kunjungan.
   *
   * Jadi kalau kunjungan sudah completed,
   * antrean juga ditampilkan Selesai.
   */

  switch (visitStatus) {
    case 'waiting_verification':
      return {
        key: 'waiting',
        label: 'Menunggu Verifikasi',
      }

    case 'verified':
      return {
        key:
          queueStatus === 'in_service'
            ? 'in_service'
            : queueStatus === 'called'
              ? 'called'
              : 'waiting',
        label:
          queueStatus === 'in_service'
            ? 'Sedang Dilayani'
            : queueStatus === 'called'
              ? 'Dipanggil'
              : 'Menunggu',
      }

    case 'in_service':
    case 'serving':
    case 'processing':
      return {
        key: 'in_service',
        label: 'Sedang Dilayani',
      }

    case 'completed':
    case 'done':
      return {
        key: 'done',
        label: 'Selesai',
      }

    case 'cancelled':
    case 'canceled':
      return {
        key: 'cancelled',
        label: 'Dibatalkan',
      }

    default:
      break
  }


  /*
   * Kalau visit tidak ketemu,
   * fallback ke status queue lama.
   */

  switch (queueStatus) {
    case 'called':
      return {
        key: 'called',
        label: 'Dipanggil',
      }

    case 'in_service':
      return {
        key: 'in_service',
        label: 'Sedang Dilayani',
      }

    case 'done':
      return {
        key: 'done',
        label: 'Selesai',
      }

    case 'skipped':
      return {
        key: 'skipped',
        label: 'Dilewati',
      }

    case 'waiting':
    default:
      return {
        key: 'waiting',
        label: 'Menunggu',
      }
  }
}


/*
 * Cocokkan queue dengan visit.
 *
 * Kita tidak bergantung pada queue.visit_id,
 * sehingga tidak perlu mengubah struktur database
 * yang sudah ada.
 */
function findVisitForQueue(queue, visits) {
  const queueNumber =
    queue.queue_number

  if (!queueNumber) {
    return null
  }

  /*
   * Paling aman: nomor antrean.
   */
  const byQueueNumber =
    visits.find(
      (visit) =>
        visit.queue?.queue_number ===
        queueNumber
    )

  if (byQueueNumber) {
    return byQueueNumber
  }

  /*
   * Fallback patient ID.
   */
  const patientId =
    queue.patient?.id ||
    queue.patient_id

  if (!patientId) {
    return null
  }

  return visits.find(
    (visit) =>
      visit.patient?.id === patientId &&
      visit.queue?.queue_number === queueNumber
  ) || null
}


/* =========================================================
   STATUS BADGE
========================================================= */

function QueueStatusBadge({ status }) {
  let icon = (
    <ClockIcon size={14} />
  )

  if (
    status.key === 'done'
  ) {
    icon = (
      <CheckIcon size={14} />
    )
  }

  if (
    status.key === 'cancelled' ||
    status.key === 'skipped'
  ) {
    icon = (
      <SkipIcon size={14} />
    )
  }

  return (
    <span
      className={`queue-status queue-status--${status.key}`}
    >
      <span className="queue-status-icon">
        {icon}
      </span>

      {status.label}
    </span>
  )
}


/* =========================================================
   COMPONENT
========================================================= */

export default function AntrianPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [queues, setQueues] =
    useState([])

  const [visits, setVisits] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState('')


  /* =======================================================
     LOAD DATA
  ======================================================= */

  async function loadQueues(
    showLoading = true
  ) {
    if (showLoading) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    setError('')

    try {
      const facilityId = user?.facility_id

      /*
       * Ambil queue dan visit bersamaan.
       *
       * Queue = nomor antrean
       * Visit = status proses pelayanan
       */

      const [
        queueResponse,
        visitResponse,
      ] = await Promise.all([
        getQueues(facilityId),
        getVisits(facilityId),
      ])


      const queueRows =
        Array.isArray(
          queueResponse?.data
        )
          ? queueResponse.data
          : []


      const visitRows =
        Array.isArray(
          visitResponse?.data
        )
          ? visitResponse.data
          : []


      setQueues(queueRows)
      setVisits(visitRows)

    } catch (err) {
      console.error(
        'Gagal mengambil data antrean:',
        err
      )

      setError(
        extractErrorMessage(err)
      )

    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }


  useEffect(() => {
    loadQueues(true)
  }, [])


  /* =======================================================
     NORMALIZED QUEUES
  ======================================================= */

  const normalizedQueues =
    useMemo(() => {
      return queues
        .map((queue) => {
          const visit =
            findVisitForQueue(
              queue,
              visits
            )

          const effectiveStatus =
            normalizeStatus(
              visit?.status,
              queue.status
            )

          return {
            ...queue,

            visit,

            patientName:
              queue.patient?.name ||
              visit?.patient?.name ||
              'Pasien',

            patientJariId:
              queue.patient?.jari_id ||
              visit?.patient?.jari_id ||
              '—',

            polyclinicName:
              queue.polyclinic?.name ||
              'Poliklinik',

            polyclinicCode:
              queue.polyclinic?.code ||
              '',

            queueNumber:
              queue.queue_number ||
              '—',

            effectiveStatus,

            calledAt:
              queue.called_at ||
              null,
          }
        })
        .sort((a, b) => {
          /*
           * Urut berdasarkan nomor antrean.
           * P-001, P-002, dst.
           */
          return String(
            a.queueNumber
          ).localeCompare(
            String(
              b.queueNumber
            ),
            undefined,
            {
              numeric: true,
              sensitivity: 'base',
            }
          )
        })
    }, [
      queues,
      visits,
    ])


  /* =======================================================
     CURRENTLY SERVING
  ======================================================= */

  const currentQueue =
    useMemo(() => {
      /*
       * Yang sedang dilayani harus
       * mengikuti status KUNJUNGAN.
       */

      return normalizedQueues.find(
        (queue) =>
          queue.effectiveStatus.key ===
          'in_service'
      ) || null
    }, [
      normalizedQueues,
    ])


  /* =======================================================
     STATISTICS
  ======================================================= */

  const waitingCount =
    normalizedQueues.filter(
      (queue) =>
        queue.effectiveStatus.key ===
          'waiting' ||
        queue.effectiveStatus.key ===
          'called'
    ).length


  const completedCount =
    normalizedQueues.filter(
      (queue) =>
        queue.effectiveStatus.key ===
        'done'
    ).length


  /* =======================================================
     DETAIL
  ======================================================= */

  function handleDetail(queue) {
    if (queue.visit?.id) {
      navigate(
        `/kunjungan/${queue.visit.id}`
      )
    }
  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="antrian-page">

        <div className="antrian-loading">

          <div className="antrian-loading-spinner" />

          <strong>
            Memuat nomor antrean...
          </strong>

          <span>
            Mengambil data antrean pasien hari ini.
          </span>

        </div>

      </div>
    )
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="antrian-page">

        <div className="antrian-error">

          <div>

            <strong>
              Data antrean tidak dapat dimuat
            </strong>

            <span>
              {error}
            </span>

          </div>

          <button
            type="button"
            onClick={() =>
              loadQueues(true)
            }
          >
            Coba Lagi
          </button>

        </div>

      </div>
    )
  }


  return (
    <div className="antrian-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="antrian-page-header">

        <div className="antrian-header-left">

          <div className="antrian-header-icon">
            <QueueIcon size={25} />
          </div>

          <div>

            <h1>
              Nomor Antrian
            </h1>

            <p>
              Kelola dan pantau antrean pasien hari ini.
            </p>

          </div>

        </div>


        <div className="antrian-date">

          <span>
            Antrean hari ini
          </span>

          <strong>
            {formatDateIndonesia()}
          </strong>

        </div>

      </div>


      {/* =================================================
          CURRENT QUEUE
      ================================================= */}

      <section className="current-queue-card">

        <div className="current-queue-header">

          <div>

            <span className="section-eyebrow">
              SEDANG DILAYANI
            </span>

            {currentQueue ? (

              <div className="current-queue-title">

                <strong>
                  {currentQueue.queueNumber}
                </strong>

                <span>
                  {currentQueue.patientName}
                </span>

              </div>

            ) : (

              <h2>
                Belum ada antrean
              </h2>

            )}

          </div>


          <div className="current-queue-count">

            <strong>
              {waitingCount}
            </strong>

            <span>
              menunggu
            </span>

          </div>

        </div>


        <div className="current-queue-body">

          {currentQueue ? (

            <div className="current-queue-active">

              <div className="current-queue-number">
                {currentQueue.queueNumber}
              </div>

              <div className="current-queue-patient">

                <strong>
                  {currentQueue.patientName}
                </strong>

                <span>
                  <UserIcon size={14} />
                  {currentQueue.patientJariId}
                </span>

                <span>
                  <HospitalIcon size={14} />
                  {currentQueue.polyclinicName}
                </span>

              </div>


              <div className="current-queue-status">

                <span>
                  STATUS
                </span>

                <strong>
                  Sedang Dilayani
                </strong>

              </div>


              {currentQueue.visit?.id && (
                <button
                  type="button"
                  className="current-queue-detail"
                  onClick={() =>
                    handleDetail(
                      currentQueue
                    )
                  }
                >
                  Detail
                  <ArrowRightIcon size={16} />
                </button>
              )}

            </div>

          ) : (

            <div className="current-queue-empty">

              <QueueIcon size={34} />

              <div>

                <strong>
                  Belum ada antrean yang sedang dilayani
                </strong>

                <span>
                  Antrean yang sudah terdaftar akan muncul di bawah.
                </span>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* =================================================
          LIST
      ================================================= */}

      <section className="queue-list-card">

        <div className="queue-list-header">

          <div>

            <span className="section-eyebrow">
              DAFTAR ANTREAN
            </span>

            <h2>
              Antrean Pasien
            </h2>

          </div>


          <div className="queue-header-actions">

            <div className="queue-summary">

              <span>
                Menunggu
              </span>

              <strong>
                {waitingCount}
              </strong>

            </div>

            <div className="queue-summary">

              <span>
                Selesai
              </span>

              <strong>
                {completedCount}
              </strong>

            </div>


            <button
              type="button"
              className="queue-refresh-button"
              onClick={() =>
                loadQueues(false)
              }
              disabled={refreshing}
            >

              <RefreshIcon
                size={17}
              />

              {refreshing
                ? 'Memuat...'
                : 'Refresh'}

            </button>

          </div>

        </div>


        <div className="queue-table-wrapper">

          <table className="queue-table">

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Pasien
                </th>

                <th>
                  Poli
                </th>

                <th>
                  Nomor Antrean
                </th>

                <th>
                  Status
                </th>

                <th>
                  Dipanggil
                </th>

                <th>
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>

              {normalizedQueues.length > 0 ? (

                normalizedQueues.map(
                  (queue, index) => (

                    <tr
                      key={queue.id}
                    >

                      <td>
                        <span className="queue-row-number">
                          {index + 1}
                        </span>
                      </td>


                      <td>

                        <div className="queue-patient">

                          <div className="queue-avatar">
                            {getInitials(
                              queue.patientName
                            )}
                          </div>

                          <div className="queue-patient-info">

                            <strong>
                              {queue.patientName}
                            </strong>

                            <span>
                              <UserIcon size={13} />
                              {queue.patientJariId}
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <div className="queue-poly">

                          <span className="queue-poly-icon">
                            {queue.polyclinicCode
                              ? queue.polyclinicCode.slice(0, 4).toUpperCase()
                              : (
                                <HospitalIcon size={16} />
                              )}
                          </span>

                          <span>
                            {queue.polyclinicName}
                          </span>

                        </div>

                      </td>


                      <td>

                        <strong className="queue-number">
                          {queue.queueNumber}
                        </strong>

                      </td>


                      <td>

                        <QueueStatusBadge
                          status={
                            queue.effectiveStatus
                          }
                        />

                      </td>


                      <td>

                        {queue.calledAt ? (
                          <span className="queue-called-time">
                            {new Date(
                              queue.calledAt
                            ).toLocaleTimeString(
                              'id-ID',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        ) : (
                          <span className="queue-not-called">
                            —
                          </span>
                        )}

                      </td>


                      <td>

                        {queue.visit?.id ? (

                          <button
                            type="button"
                            className="queue-detail-button"
                            onClick={() =>
                              handleDetail(
                                queue
                              )
                            }
                          >

                            <span>
                              Detail
                            </span>

                            <ArrowRightIcon size={15} />

                          </button>

                        ) : (

                          <span className="queue-no-detail">
                            —
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="queue-empty-cell"
                  >

                    <div className="queue-empty">

                      <QueueIcon size={30} />

                      <strong>
                        Belum ada antrean hari ini
                      </strong>

                      <span>
                        Antrean pasien yang sudah didaftarkan akan muncul di sini.
                      </span>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="queue-list-footer">

          <span>
            Total {normalizedQueues.length} antrean hari ini
          </span>

          <span>
            Status mengikuti proses kunjungan pasien.
          </span>

        </div>

      </section>

    </div>
  )
}