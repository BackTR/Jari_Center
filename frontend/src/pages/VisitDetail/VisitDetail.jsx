import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getVisit, updateVisitStage } from '../../api/visits.js'
import { extractErrorMessage } from '../../utils/errors.js'
import { formatDateTime } from '../../utils/date.js'
import {
  getNextStageOptions,
  stageLabel,
  PAYMENT_METHOD_LABELS,
  IDENTIFICATION_METHOD_LABELS,
} from '../../utils/stage.js'
import StageBadge from '../../components/StageBadge/StageBadge.jsx'
import './VisitDetail.css'


/* =========================================================
   ICON
========================================================= */

function Icon({ name, size = 18 }) {
  const paths = {
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    check: (
      <path d="m5 12 4 4L19 6" />
    ),

    x: (
      <>
        <path d="m7 7 10 10" />
        <path d="m17 7-10 10" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c.8-4 3-6 7-6s6.2 2 7 6" />
      </>
    ),

    fingerprint: (
      <>
        <path d="M12 3.5a8.5 8.5 0 0 0-8.5 8.5" />
        <path d="M12 6a6 6 0 0 0-6 6" />
        <path d="M12 8.5A3.5 3.5 0 0 0 8.5 12" />
        <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" />
        <path d="M12 6a6 6 0 0 1 6 6" />
        <path d="M12 8.5a3.5 3.5 0 0 1 3.5 3.5" />
        <path d="M7 15.5c1-1.1 1.5-2.4 1.5-3.5" />
        <path d="M17 15.5c-1-1.1-1.5-2.4-1.5-3.5" />
        <path d="M12 20v-5" />
      </>
    ),

    idCard: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="11" r="1.8" />
        <path d="M6 16c.5-1.6 1.5-2.4 2.5-2.4s2 .8 2.5 2.4" />
        <path d="M14 9.5h4M14 13h4" />
      </>
    ),

    wallet: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <path d="M16 14h3" />
        <circle
          cx="16"
          cy="14"
          r="0.8"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),

    clinic: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M12 8v6M9 11h6" />
        <path d="M8 20v-2M16 20v-2" />
      </>
    ),

    document: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h4" />
        <path d="M10 12h5M10 16h5" />
      </>
    ),

    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
      </>
    ),

    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    note: (
      <>
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
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
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}


/* =========================================================
   HELPER
========================================================= */

function getInitial(name) {
  return name?.charAt(0)?.toUpperCase() || '?'
}


function getStageActionLabel(stage) {
  if (stage === 'verified') {
    return 'Verifikasi Kunjungan'
  }

  if (stage === 'cancelled') {
    return 'Batalkan Kunjungan'
  }

  return `Ubah ke ${stageLabel(stage)}`
}


function getStageActionIcon(stage) {
  if (stage === 'verified') {
    return 'check'
  }

  if (stage === 'cancelled') {
    return 'x'
  }

  return 'check'
}


/* =========================================================
   COMPONENT
========================================================= */

export default function VisitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [visit, setVisit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [stageNotes, setStageNotes] = useState('')
  const [updatingStage, setUpdatingStage] = useState('')
  const [stageError, setStageError] = useState('')


  /* =====================================================
     LOAD DETAIL KUNJUNGAN
  ===================================================== */

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    getVisit(id)
      .then(({ data }) => {
        if (active) {
          setVisit(data.data)
        }
      })
      .catch((err) => {
        if (active) {
          setError(extractErrorMessage(err))
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [id])


  /* =====================================================
     UPDATE STAGE
  ===================================================== */

  async function handleStageChange(nextStage) {
    setStageError('')
    setUpdatingStage(nextStage)

    try {
      const { data } = await updateVisitStage(
        id,
        nextStage,
        stageNotes.trim() || null
      )

      setVisit(data.data)
      setStageNotes('')
    } catch (err) {
      setStageError(extractErrorMessage(err))
    } finally {
      setUpdatingStage('')
    }
  }


  /* =====================================================
     KEMBALI KE DAFTAR KUNJUNGAN
  ===================================================== */

  function handleBackToVisits() {
    navigate('/kunjungan')
  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="page visit-detail-page">

        <div className="visit-loading">

          <div className="visit-loading-spinner" />

          <div>
            <strong>
              Memuat kunjungan...
            </strong>

            <span>
              Mohon tunggu sebentar.
            </span>
          </div>

        </div>

      </div>
    )
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="page visit-detail-page">

        <div className="visit-error-card">

          <div className="visit-error-icon">
            <Icon
              name="x"
              size={24}
            />
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
            className="visit-back-btn"
            onClick={handleBackToVisits}
          >
            <Icon
              name="arrowLeft"
              size={16}
            />

            Kembali ke kunjungan
          </button>

        </div>

      </div>
    )
  }


  if (!visit) {
    return null
  }


  /* =====================================================
     DATA
  ===================================================== */

  const nextOptions =
    getNextStageOptions(visit.status)

  const patientName =
    visit.patient?.name ||
    'Pasien'

  const patientJariId =
    visit.patient?.jari_id ||
    '—'

  const identificationLabel =
    IDENTIFICATION_METHOD_LABELS[
      visit.identification_method
    ] ||
    visit.identification_method ||
    '—'

  const paymentLabel =
    PAYMENT_METHOD_LABELS[
      visit.payment_method
    ] ||
    visit.payment_method ||
    '—'

  const isWaiting =
    visit.status === 'waiting_verification'

  const isCancelled =
    visit.status === 'cancelled'

  const isVerified =
    visit.status === 'verified'


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="page visit-detail-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="visit-detail-header">

        <div className="visit-header-main">

          {/* =================================================
              TOMBOL KEMBALI
          ================================================= */}

          <button
            type="button"
            className="visit-detail-back-button"
            onClick={handleBackToVisits}
          >
            <Icon
              name="arrowLeft"
              size={17}
            />

            <span>
              Kembali ke Kunjungan
            </span>
          </button>


          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div className="visit-breadcrumb">

            <span>
              Kunjungan
            </span>

            <span>
              /
            </span>

            <strong>
              #{visit.id}
            </strong>

          </div>


          <h1>
            Kunjungan #{visit.id}
          </h1>


          <p className="visit-header-patient">

            {patientName}

            <span>
              •
            </span>

            <span className="mono">
              {patientJariId}
            </span>

          </p>

        </div>


        {/* =================================================
            STATUS BESAR
        ================================================= */}

        <div
          className={`visit-status-card ${
            isWaiting
              ? 'status-waiting'
              : isVerified
                ? 'status-verified'
                : isCancelled
                  ? 'status-cancelled'
                  : ''
          }`}
        >

          <div className="visit-status-icon">

            {isWaiting && (
              <Icon
                name="clock"
                size={25}
              />
            )}

            {isVerified && (
              <Icon
                name="check"
                size={25}
              />
            )}

            {isCancelled && (
              <Icon
                name="x"
                size={25}
              />
            )}

            {!isWaiting &&
              !isVerified &&
              !isCancelled && (
                <Icon
                  name="clock"
                  size={25}
                />
              )}

          </div>


          <div className="visit-status-content">

            <span className="visit-status-label">
              STATUS KUNJUNGAN
            </span>

            <strong>
              {stageLabel(visit.status)}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          PATIENT CARD
      ================================================= */}

      <div className="visit-patient-card">

        <div className="visit-patient-avatar">
          {getInitial(patientName)}
        </div>


        <div className="visit-patient-info">

          <span className="visit-card-label">
            PASIEN
          </span>

          <h2>
            {patientName}
          </h2>

          <div className="visit-patient-id">

            <Icon
              name="fingerprint"
              size={15}
            />

            <span className="mono">
              {patientJariId}
            </span>

          </div>

        </div>


        <div className="visit-patient-number">

          <span>
            NO. KUNJUNGAN
          </span>

          <strong>
            #{visit.id}
          </strong>

        </div>

      </div>


      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className="visit-info-section">

        <div className="visit-section-heading">

          <div className="visit-section-icon">

            <Icon
              name="document"
              size={18}
            />

          </div>


          <div>

            <h2>
              Informasi Kunjungan
            </h2>

            <p>
              Detail data yang digunakan saat pendaftaran.
            </p>

          </div>

        </div>


        <div className="visit-info-grid">


          {/* FASKES */}

          <div className="visit-info-card">

            <div className="visit-info-card-icon">

              <Icon
                name="clinic"
                size={19}
              />

            </div>

            <div>

              <span>
                Faskes
              </span>

              <strong>
                {visit.facility_name ||
                  `Faskes #${visit.facility_id}`}
              </strong>

            </div>

          </div>


          {/* POLIKLINIK */}

          <div className="visit-info-card">

            <div className="visit-info-card-icon">

              <Icon
                name="clinic"
                size={19}
              />

            </div>

            <div>

              <span>
                Poliklinik
              </span>

              <strong>
                {visit.polyclinic_name ||
                  (visit.polyclinic_id
                    ? `Poliklinik #${visit.polyclinic_id}`
                    : 'Tidak dipilih')}
              </strong>

            </div>

          </div>


          {/* IDENTIFIKASI */}

          <div className="visit-info-card">

            <div className="visit-info-card-icon">

              <Icon
                name="fingerprint"
                size={19}
              />

            </div>

            <div>

              <span>
                Metode identifikasi
              </span>

              <strong>
                {identificationLabel}
              </strong>

            </div>

          </div>


          {/* PEMBAYARAN */}

          <div className="visit-info-card">

            <div className="visit-info-card-icon">

              <Icon
                name="wallet"
                size={19}
              />

            </div>

            <div>

              <span>
                Metode pembayaran
              </span>

              <strong>
                {paymentLabel}
              </strong>

            </div>

          </div>


          {/* BPJS */}

          {visit.payment_method === 'bpjs' && (

            <div className="visit-info-card">

              <div className="visit-info-card-icon">

                <Icon
                  name="idCard"
                  size={19}
                />

              </div>

              <div>

                <span>
                  Nomor BPJS
                </span>

                <strong className="mono">
                  {visit.bpjs_number || '—'}
                </strong>

              </div>

            </div>

          )}


          {/* RUJUKAN */}

          <div className="visit-info-card">

            <div className="visit-info-card-icon">

              <Icon
                name="document"
                size={19}
              />

            </div>

            <div>

              <span>
                Nomor surat rujukan
              </span>

              <strong>
                {visit.referral_letter_number ||
                  'Tidak ada'}
              </strong>

            </div>

          </div>


          {/* CREATED */}

          <div className="visit-info-card">

            <div className="visit-info-card-icon">

              <Icon
                name="clock"
                size={19}
              />

            </div>

            <div>

              <span>
                Waktu dibuat
              </span>

              <strong>
                {formatDateTime(visit.created_at)}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          NOTES
      ================================================= */}

      {visit.notes && (

        <div className="visit-note-card">

          <div className="visit-note-icon">

            <Icon
              name="note"
              size={19}
            />

          </div>

          <div>

            <span>
              CATATAN KUNJUNGAN
            </span>

            <p>
              {visit.notes}
            </p>

          </div>

        </div>

      )}


      {/* =================================================
          STAGE ACTION
      ================================================= */}

      {nextOptions.length > 0 && (

        <div className="visit-action-card">

          <div className="visit-section-heading">

            <div className="visit-section-icon action-icon">

              <Icon
                name="check"
                size={18}
              />

            </div>

            <div>

              <h2>
                Proses Kunjungan
              </h2>

              <p>
                Perbarui status kunjungan setelah proses verifikasi.
              </p>

            </div>

          </div>


          {/* ERROR */}

          {stageError && (

            <div className="visit-stage-error">

              <Icon
                name="x"
                size={16}
              />

              {stageError}

            </div>

          )}


          {/* CATATAN */}

          <div className="visit-stage-note">

            <label htmlFor="stage_notes">

              CATATAN VERIFIKASI

              <span>
                Opsional
              </span>

            </label>


            <textarea
              id="stage_notes"
              rows={3}
              value={stageNotes}
              onChange={(e) =>
                setStageNotes(e.target.value)
              }
              placeholder="Contoh: Data pasien cocok dan identitas sudah diverifikasi."
            />

          </div>


          {/* BUTTON STATUS */}

          <div className="visit-action-buttons">

            {nextOptions.map((stage) => {

              const isCancel =
                stage === 'cancelled'

              const isUpdating =
                updatingStage === stage

              return (

                <button
                  key={stage}
                  type="button"
                  className={
                    isCancel
                      ? 'visit-action-btn visit-action-cancel'
                      : 'visit-action-btn visit-action-verify'
                  }
                  disabled={
                    updatingStage !== ''
                  }
                  onClick={() =>
                    handleStageChange(stage)
                  }
                >

                  <span className="visit-action-btn-icon">

                    <Icon
                      name={getStageActionIcon(stage)}
                      size={18}
                    />

                  </span>


                  <span>

                    {isUpdating
                      ? 'Memproses...'
                      : getStageActionLabel(stage)}

                  </span>

                </button>

              )
            })}

          </div>

        </div>

      )}


      {/* =================================================
          HISTORY
      ================================================= */}

      <div className="visit-history-card">

        <div className="visit-section-heading">

          <div className="visit-section-icon">

            <Icon
              name="history"
              size={18}
            />

          </div>

          <div>

            <h2>
              Riwayat Kunjungan
            </h2>

            <p>
              Perubahan status kunjungan dari waktu ke waktu.
            </p>

          </div>

        </div>


        <div className="visit-timeline">

          {visit.stage_history?.map(
            (entry, idx) => {

              const isLast =
                idx ===
                visit.stage_history.length - 1

              const isCurrent =
                idx ===
                visit.stage_history.length - 1

              return (

                <div
                  className={`visit-timeline-item ${
                    isCurrent
                      ? 'is-current'
                      : ''
                  }`}
                  key={idx}
                >

                  <div className="visit-timeline-marker">

                    <div className="visit-timeline-dot">

                      {entry.stage === 'verified' ? (

                        <Icon
                          name="check"
                          size={11}
                        />

                      ) : entry.stage === 'cancelled' ? (

                        <Icon
                          name="x"
                          size={11}
                        />

                      ) : (

                        <Icon
                          name="clock"
                          size={11}
                        />

                      )}

                    </div>


                    {!isLast && (

                      <div className="visit-timeline-line" />

                    )}

                  </div>


                  <div className="visit-timeline-content">

                    <div className="visit-timeline-top">

                      <strong>
                        {stageLabel(entry.stage)}
                      </strong>


                      {isCurrent && (

                        <span className="timeline-current">
                          Status saat ini
                        </span>

                      )}

                    </div>


                    <span className="visit-timeline-time">

                      {formatDateTime(
                        entry.changed_at
                      )}

                    </span>


                    {entry.notes && (

                      <div className="visit-timeline-note">
                        {entry.notes}
                      </div>

                    )}

                  </div>

                </div>

              )
            }
          )}

        </div>

      </div>


      {/* =================================================
          BOTTOM BACK BUTTON
      ================================================= */}

      <div className="visit-detail-bottom">

        <button
          type="button"
          className="visit-detail-back-button visit-detail-back-button--bottom"
          onClick={handleBackToVisits}
        >

          <Icon
            name="arrowLeft"
            size={18}
          />

          <span>
            Kembali ke Daftar Kunjungan
          </span>

        </button>

      </div>


    </div>
  )
}