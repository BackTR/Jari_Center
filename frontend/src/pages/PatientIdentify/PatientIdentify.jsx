import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { identifyPatient } from '../../api/patients.js'
import { extractErrorMessage } from '../../utils/errors.js'
import PatientResultCard from '../../components/PatientResultCard/PatientResultCard.jsx'
import './PatientIdentify.css'


/* =========================================================
   ICONS
   ========================================================= */

function FingerprintIcon({ size = 20 }) {
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
      <path d="M12 11.5a2.5 2.5 0 0 1 2.5 2.5c0 3.5-.7 6.2-2 8" />
      <path d="M9.5 14c0-1.4 1.1-2.5 2.5-2.5" />
      <path d="M7 14c0-2.8 2.2-5 5-5s5 2.2 5 5c0 2.7-.4 5.2-1.2 7" />
      <path d="M4.8 14c0-4 3.2-7.2 7.2-7.2s7.2 3.2 7.2 7.2c0 1.8-.2 3.7-.7 5.3" />
      <path d="M6.2 19.5c.5-1.8.8-3.7.8-5.5" />
      <path d="M9 21c.8-2.1 1.2-4.4 1.2-7" />
    </svg>
  )
}


function FaceIcon({ size = 20 }) {
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
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M8.5 15c1.8 1.4 5.2 1.4 7 0" />
    </svg>
  )
}


function QrIcon({ size = 20 }) {
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
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 14h2v2h-2z" />
      <path d="M18 14h2v2h-2z" />
      <path d="M14 18h2v2h-2z" />
      <path d="M18 18h2" />
    </svg>
  )
}


function SearchIcon({ size = 20 }) {
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
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  )
}


/* =========================================================
   METODE IDENTIFIKASI
   ========================================================= */

const METHOD_OPTIONS = [
  {
    value: 'fingerprint',
    label: 'Sidik Jari',
    icon: FingerprintIcon,
  },
  {
    value: 'face',
    label: 'Face',
    icon: FaceIcon,
  },
  {
    value: 'qr',
    label: 'QR Code',
    icon: QrIcon,
  },
  {
    value: 'search',
    label: 'Cari NIK / Nama',
    icon: SearchIcon,
  },
]


/* =========================================================
   TIPE PENCARIAN
   ========================================================= */

const TYPE_OPTIONS = [
  {
    value: 'nik',
    label: 'NIK',
  },
  {
    value: 'jari_id',
    label: 'Jari ID',
  },
  {
    value: 'keyword',
    label: 'Nama',
  },
]


/* =========================================================
   COMPONENT
   ========================================================= */

export default function PatientIdentify() {
  const navigate = useNavigate()

  const [method, setMethod] = useState('search')

  const [type, setType] = useState('nik')
  const [value, setValue] = useState('')

  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)


  /* =======================================================
     GANTI METODE
     ======================================================= */

  function handleMethodChange(nextMethod) {
    setMethod(nextMethod)

    setError('')
    setResults(null)
    setSearched(false)
    setValue('')
  }


  /* =======================================================
     CARI PASIEN
     ======================================================= */

  async function handleSubmit(e) {
    e.preventDefault()

    if (value.trim().length < 2) {
      setError('Minimal 2 karakter untuk pencarian.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const { data } = await identifyPatient(
        type,
        value.trim()
      )

      setResults(data.data || [])
      setSearched(true)
    } catch (err) {
      setError(extractErrorMessage(err))
      setResults(null)
    } finally {
      setLoading(false)
    }
  }


  /* =======================================================
     MULAI KUNJUNGAN
     ======================================================= */

  function handleStartVisit(patient) {
    navigate('/kunjungan/baru', {
      state: {
        patient,
      },
    })
  }


  /* =======================================================
     PLACEHOLDER
     ======================================================= */

  function getPlaceholder() {
    if (type === 'nik') {
      return 'Masukkan NIK pasien'
    }

    if (type === 'jari_id') {
      return 'Masukkan Jari ID pasien'
    }

    return 'Masukkan nama pasien'
  }


  return (
    <div className="page patient-identify-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="page-header">

        <h1>
          Identifikasi Pasien
        </h1>

        <p>
          Pilih metode identifikasi untuk menemukan data pasien
          sebelum mendaftarkan kunjungan.
        </p>

      </div>


      {/* ===================================================
          PANEL
          =================================================== */}

      <section className="jari-panel identify-panel">

        {/* =================================================
            TABS
            ================================================= */}

        <div className="identify-tabs">

          {METHOD_OPTIONS.map((option) => {

            const Icon = option.icon

            return (
              <button
                key={option.value}
                type="button"
                className={`identify-tab ${
                  method === option.value
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleMethodChange(option.value)
                }
              >
                <Icon size={19} />

                <span>
                  {option.label}
                </span>
              </button>
            )
          })}

        </div>


        {/* =================================================
            SIDIK JARI
            ================================================= */}

        {method === 'fingerprint' && (

          <div className="identify-method-content">

            <div className="scanner-area">

              <div className="scanner-icon fingerprint">
                <FingerprintIcon size={62} />
              </div>

              <div className="scanner-text">

                <h2>
                  Identifikasi dengan Sidik Jari
                </h2>

                <p>
                  Letakkan jari pasien pada scanner
                  untuk mencari data pasien.
                </p>

              </div>

            </div>

            <div className="method-info">

              <span className="method-status-dot" />

              <span>
                Menunggu scanner sidik jari
              </span>

            </div>

          </div>
        )}


        {/* =================================================
            FACE
            ================================================= */}

        {method === 'face' && (

          <div className="identify-method-content">

            <div className="scanner-area">

              <div className="scanner-icon face">
                <FaceIcon size={56} />
              </div>

              <div className="scanner-text">

                <h2>
                  Identifikasi dengan Face
                </h2>

                <p>
                  Arahkan wajah pasien ke kamera
                  untuk melakukan identifikasi.
                </p>

              </div>

            </div>

            <div className="method-info">

              <span className="method-status-dot" />

              <span>
                Kamera siap digunakan
              </span>

            </div>

          </div>
        )}


        {/* =================================================
            QR CODE
            ================================================= */}

        {method === 'qr' && (

          <div className="identify-method-content">

            <div className="scanner-area">

              <div className="scanner-icon qr">
                <QrIcon size={56} />
              </div>

              <div className="scanner-text">

                <h2>
                  Identifikasi dengan QR Code
                </h2>

                <p>
                  Arahkan QR Code pasien ke kamera
                  untuk mencari data pasien.
                </p>

              </div>

            </div>

            <div className="method-info">

              <span className="method-status-dot" />

              <span>
                Scanner QR Code siap digunakan
              </span>

            </div>

          </div>
        )}


        {/* =================================================
            CARI NIK / NAMA
            ================================================= */}

        {method === 'search' && (

          <div className="search-method-content">

            <form
              onSubmit={handleSubmit}
              className="identify-form"
            >

              <div className="identify-form-row">

                {/* =========================================
                    DROPDOWN
                    ========================================= */}

                <div className="identify-field">

                  <label htmlFor="type">
                    Cari berdasarkan
                  </label>

                  <select
                    id="type"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value)
                      setValue('')
                      setError('')
                      setResults(null)
                      setSearched(false)
                    }}
                  >

                    {TYPE_OPTIONS.map((option) => (

                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>

                    ))}

                  </select>

                </div>


                {/* =========================================
                    INPUT
                    ========================================= */}

                <div className="identify-field">

                  <label htmlFor="value">
                    Kata kunci
                  </label>

                  <div className="identify-input">

                    <SearchIcon size={19} />

                    <input
                      id="value"
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setValue(e.target.value)
                      }
                      placeholder={getPlaceholder()}
                      autoComplete="off"
                    />

                  </div>

                </div>


                {/* =========================================
                    BUTTON
                    ========================================= */}

                <div className="identify-button-field">

                  <div
                    className="identify-label-spacer"
                    aria-hidden="true"
                  />

                  <button
                    type="submit"
                    className="jari-primary-btn identify-submit"
                    disabled={loading}
                  >

                    <SearchIcon size={18} />

                    <span>
                      {loading
                        ? 'Mencari...'
                        : 'Cari Pasien'
                      }
                    </span>

                  </button>

                </div>

              </div>

            </form>


            {/* =============================================
                ERROR
                ============================================= */}

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}


            {/* =============================================
                HASIL
                ============================================= */}

            {searched && !error && (

              results.length === 0 ? (

                <div className="alert alert-empty">

                  Pasien tidak ditemukan.

                  <br />

                  Kalau ini pasien baru, daftarkan
                  lewat menu <strong>
                    Daftarkan Pasien
                  </strong>.

                </div>

              ) : (

                <div className="identify-results">

                  {results.map((patient) => (

                    <PatientResultCard
                      key={patient.id}
                      patient={patient}
                      onStartVisit={handleStartVisit}
                    />

                  ))}

                </div>

              )

            )}

          </div>
        )}

      </section>

    </div>
  )
}