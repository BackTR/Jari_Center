import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

import { getQueues } from '../../api/queues.js'
import { getVisits } from '../../api/visits.js'
import { extractErrorMessage } from '../../utils/errors.js'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  HospitalIcon,
  QueueIcon,
  RefreshIcon,
  UserIcon,
  XCircleIcon,
} from '../../components/icons.jsx'

import './AntrianPage.css'


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


/**
 * Antrean tidak punya tahap sendiri; API mengirim visit_status yang sama
 * dengan visits.status. Peta ini hanya untuk warna/label tampilan.
 */
const QUEUE_STATUS_VIEW = {
  pending_verification: { key: 'waiting', label: 'Menunggu Verifikasi' },
  verified: { key: 'waiting', label: 'Menunggu' },
  registered: { key: 'called', label: 'Dipanggil' },
  in_service: { key: 'in_service', label: 'Sedang Dilayani' },
  completed: { key: 'done', label: 'Selesai' },
  cancelled: { key: 'skipped', label: 'Dibatalkan' },
}

function normalizeStatus(visitStatus) {
  return QUEUE_STATUS_VIEW[visitStatus] || { key: 'waiting', label: 'Menunggu' }
}


function findVisitForQueue(queue, visits) {
  if (queue.visit_id != null) {
    const byVisitId = visits.find(v => Number(v.id) === Number(queue.visit_id))
    if (byVisitId) return byVisitId
  }

  // ponytail: queue tanpa visit_id (data lama) dicocokkan via nomor antrean.
  // Saat semua data ter-backfill dari visit registration, hapus fallback ini.
  if (!queue.queue_number) return null

  return visits.find(v => v.queue?.queue_number === queue.queue_number) || null
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
      <CheckCircleIcon size={14} />
    )
  }

  if (
    status.key === 'cancelled' ||
    status.key === 'skipped'
  ) {
    icon = (
      <XCircleIcon size={14} />
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
              queue.visit_status ||
              visit?.status
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