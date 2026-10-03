import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  identifyPatient,
  matchFingerprint,
} from '../../api/patients.js'
import { extractErrorMessage } from '../../utils/errors.js'
import PatientResultCard from '../../components/PatientResultCard/PatientResultCard.jsx'
import {
  FingerprintIcon,
  SearchIcon,
} from '../../components/icons.jsx'
import './PatientIdentify.css'


/* =========================================================
   METODE IDENTIFIKASI
   ========================================================= */

// Hanya ada endpoint untuk sidik jari. Face & QR dihapus: panelnya
// dekorasi, tidak pernah memanggil backend apa pun.
const METHOD_OPTIONS = [
  {
    value: 'fingerprint',
    label: 'Sidik Jari',
    icon: FingerprintIcon,
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
     PINDAI SIDIK JARI
     ======================================================= */

  async function handleFingerprintScan(e) {
    e.preventDefault()

    if (value.trim().length < 2) {
      setError('Tempel template sidik jari hasil scan.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const { data } = await matchFingerprint(value.trim())

      setResults(data.matched ? [data.data] : [])
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

            <form
              onSubmit={handleFingerprintScan}
              className="identify-form"
            >

              <div className="identify-field">

                <label htmlFor="fp-template">
                  Template sidik jari
                </label>

                <div className="identify-input">

                  <FingerprintIcon size={19} />

                  <input
                    id="fp-template"
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setValue(e.target.value)
                    }
                    placeholder="Tempel hasil scan scanner di sini"
                    autoComplete="off"
                  />

                </div>

              </div>

              <div className="identify-button-field">

                <button
                  type="submit"
                  className="jari-primary-btn identify-submit"
                  disabled={loading}
                >

                  <FingerprintIcon size={18} />

                  <span>
                    {loading
                      ? 'Memindai...'
                      : 'Identifikasi'
                    }
                  </span>

                </button>

              </div>

            </form>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {searched && !error && (
              results.length === 0 ? (

                <div className="alert alert-empty">
                  Sidik jari tidak cocok dengan data pasien.
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