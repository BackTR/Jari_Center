import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { identifyPatient } from '../../api/patients.js'
import { createVisit } from '../../api/visits.js'
import { getPolyclinics } from '../../api/polyclinics.js'
import { extractErrorMessage, extractFieldErrors } from '../../utils/errors.js'
import { IDENTIFICATION_METHOD_LABELS } from '../../utils/stage.js'
import './VisitRegister.css'

/* =========================================================
   ICONS
   ========================================================= */

function Icon({ name, size = 18 }) {
  const paths = {
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    chevronDown: <path d="m6 9 6 6 6-6" />,
    userCheck: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c.6-3.3 2.5-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
        <path d="m16 11 2 2 4-4" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
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
    qrCode: (
      <>
        <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
        <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
        <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
        <path d="M14.5 14.5h2.5v2.5h-2.5zM19.5 14.5v2M14.5 19.5h2M17.5 19.5h2.5v.01" />
      </>
    ),
    manual: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4.5 1L4.5 14.5Z" />
      </>
    ),
    bpjs: (
      <>
        <path d="M12 3 20 6v5c0 5.2-3.2 8.8-8 10-4.8-1.2-8-4.8-8-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="6.5" width="18" height="12" rx="2.2" />
        <path d="M3 10.5h18" />
        <circle cx="16.5" cy="14.5" r="1.2" />
      </>
    ),
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    document: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h4M10 12h5M10 16h5" />
      </>
    ),
    clinic: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M12 8v6M9 11h6" />
        <path d="M8 20v-2M16 20v-2" />
      </>
    ),
    alertTriangle: (
      <>
        <path d="M12 3.5 2.5 20h19z" />
        <path d="M12 9.5v4.5" />
        <path d="M12 17.2h.01" />
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
   CUSTOM DROPDOWN
   ========================================================= */

function Dropdown({ label, value, onChange, options, placeholder = 'Pilih…', disabled = false, hint }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((opt) => String(opt.value) === String(value))

  return (
    <div className="field dropdown-field" ref={rootRef}>
      {label && <label>{label}</label>}

      <div className="dropdown">
        <button
          type="button"
          className={`dropdown-trigger ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          disabled={disabled}
        >
          <span className="dropdown-trigger-content">
            {selected?.icon && (
              <span className="dropdown-trigger-icon">
                <Icon name={selected.icon} size={16} />
              </span>
            )}
            <span className={selected ? '' : 'dropdown-placeholder'}>
              {selected ? selected.label : placeholder}
            </span>
          </span>

          <span className="dropdown-chevron">
            <Icon name="chevronDown" size={16} />
          </span>
        </button>

        {open && !disabled && (
          <ul className="dropdown-menu">
            {options.length === 0 ? (
              <li className="dropdown-empty">Tidak ada opsi tersedia.</li>
            ) : (
              options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    className={`dropdown-option ${String(opt.value) === String(value) ? 'is-active' : ''}`}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                  >
                    {opt.icon && (
                      <span className="dropdown-option-icon">
                        <Icon name={opt.icon} size={16} />
                      </span>
                    )}
                    <span>{opt.label}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {hint && (
        <span className="dropdown-hint">
          <Icon name="alertTriangle" size={12} />
          {hint}
        </span>
      )}
    </div>
  )
}


/* =========================================================
   OPTIONS DATA
   ========================================================= */

const SEARCH_TYPE_OPTIONS = [
  { value: 'nik', label: 'NIK', icon: 'idCard' },
  { value: 'jari_id', label: 'Jari ID', icon: 'fingerprint' },
  { value: 'keyword', label: 'Nama', icon: 'search' },
]

const IDENTIFICATION_ICON = {
  jari_id: 'fingerprint',
  nik: 'idCard',
  fingerprint_simulation: 'fingerprint',
  qr_code: 'qrCode',
  manual: 'manual',
}

const PAYMENT_OPTIONS = [
  { value: 'bpjs', label: 'BPJS', icon: 'bpjs' },
  { value: 'mandiri', label: 'Mandiri', icon: 'wallet' },
]


/* =========================================================
   COMPONENT
   ========================================================= */

export default function VisitRegister() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [patient, setPatient] = useState(location.state?.patient || null)

  const [searchType, setSearchType] = useState('nik')
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)

  const [form, setForm] = useState({
    identification_method: 'nik',
    payment_method: 'bpjs',
    bpjs_number: '',
    polyclinic_id: '',
    referral_letter_number: '',
    notes: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ============ FACILITY ID: dukung 2 kemungkinan bentuk response backend ============
  const facilityId = user?.facility_id ?? user?.facility?.id ?? null

  // ============ POLIKLINIK: fetch dari database berdasarkan facilityId ============
  const [polyclinics, setPolyclinics] = useState([])
  const [polyclinicsLoading, setPolyclinicsLoading] = useState(false)
  const [polyclinicsError, setPolyclinicsError] = useState('')

  useEffect(() => {
    if (!facilityId) return

    let cancelled = false
    setPolyclinicsLoading(true)
    setPolyclinicsError('')

    getPolyclinics(facilityId)
      .then(({ data }) => {
        if (cancelled) return
        const list = data?.data || data || []
        setPolyclinics(Array.isArray(list) ? list.filter((p) => p.is_active !== false) : [])
      })
      .catch((err) => {
        if (cancelled) return

        const status = err?.response?.status
        if (status === 404) {
          setPolyclinicsError('Endpoint poliklinik tidak ditemukan (404). Cek route backend.')
        } else if (status === 401) {
          setPolyclinicsError('Sesi login tidak valid. Silakan login ulang.')
        } else {
          setPolyclinicsError(extractErrorMessage(err) || 'Gagal memuat daftar poliklinik.')
        }
      })
      .finally(() => {
        if (!cancelled) setPolyclinicsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [facilityId])

  const polyclinicOptions = polyclinics.map((p) => ({
    value: String(p.id),
    label: p.name,
    icon: 'clinic',
  }))

  const identificationOptions = Object.entries(IDENTIFICATION_METHOD_LABELS).map(
    ([value, label]) => ({
      value,
      label,
      icon: IDENTIFICATION_ICON[value] || 'idCard',
    })
  )

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (searchValue.trim().length < 2) {
      setSearchError('Minimal 2 karakter untuk pencarian.')
      return
    }
    setSearchError('')
    setSearching(true)
    try {
      const { data } = await identifyPatient(searchType, searchValue.trim())
      setSearchResults(data.data)
    } catch (err) {
      setSearchError(extractErrorMessage(err))
    } finally {
      setSearching(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (!facilityId) {
      setError('Fasilitas kesehatan tidak terdeteksi pada akun Anda. Silakan login ulang atau hubungi admin.')
      return
    }

    if (form.payment_method === 'bpjs' && !form.bpjs_number.trim()) {
      setFieldErrors({ bpjs_number: ['Nomor BPJS wajib diisi untuk metode pembayaran BPJS.'] })
      return
    }

    setLoading(true)
    const payload = {
      patient_id: patient.id,
      facility_id: facilityId,
      polyclinic_id: form.polyclinic_id ? Number(form.polyclinic_id) : null,
      identification_method: form.identification_method,
      payment_method: form.payment_method,
      bpjs_number: form.payment_method === 'bpjs' ? form.bpjs_number.trim() : null,
      referral_letter_number: form.referral_letter_number.trim() || null,
      notes: form.notes.trim() || null,
    }

    try {
      const { data } = await createVisit(payload)
      navigate(`/kunjungan/${data.data.id}`)
    } catch (err) {
      setError(extractErrorMessage(err))
      setFieldErrors(extractFieldErrors(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Daftarkan Kunjungan</h1>
        <p>Kunjungan baru selalu dimulai dengan status &ldquo;Menunggu Verifikasi&rdquo;.</p>
      </div>

      {/* ===================================================
          STEP INDICATOR
      =================================================== */}

      <div className="visit-steps">
        <div className={`visit-step ${!patient ? 'is-current' : 'is-done'}`}>
          <span className="visit-step-index">{patient ? <Icon name="userCheck" size={14} /> : '1'}</span>
          Pilih Pasien
        </div>
        <div className="visit-step-line" />
        <div className={`visit-step ${patient ? 'is-current' : ''}`}>
          <span className="visit-step-index">2</span>
          Detail Kunjungan
        </div>
      </div>

      {!patient ? (
        <div className="jari-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">LANGKAH 1</span>
              <h2>Pilih Pasien</h2>
            </div>
          </div>

          <p className="visit-panel-hint">
            Cari pasien dulu untuk melanjutkan pendaftaran kunjungan.
          </p>

          <form onSubmit={handleSearch} className="visit-search-row">
            <Dropdown
              value={searchType}
              onChange={setSearchType}
              options={SEARCH_TYPE_OPTIONS}
            />

            <div className="visit-input">
              <Icon name="search" size={18} />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Masukkan nilai pencarian"
              />
            </div>

            <button type="submit" className="jari-primary-btn" disabled={searching}>
              {searching ? 'Mencari…' : 'Cari'}
            </button>
          </form>

          {searchError && <div className="alert alert-error">{searchError}</div>}

          {searchResults && searchResults.length === 0 && (
            <div className="alert alert-empty">Tidak ada pasien yang cocok.</div>
          )}

          {searchResults && searchResults.length > 0 && (
            <ul className="visit-search-results">
              {searchResults.map((p) => (
                <li key={p.id}>
                  <div className="visit-search-result-left">
                    <div className="visit-result-avatar">
                      {p.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="visit-search-result-name">{p.name}</div>
                      <div className="mono visit-search-result-id">{p.jari_id}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="jari-primary-btn visit-select-btn"
                    onClick={() => setPatient(p)}
                  >
                    Pilih
                    <Icon name="arrowRight" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div className="jari-panel visit-selected-patient">
            <div className="visit-selected-patient-left">
              <div className="visit-selected-avatar">
                {patient.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="visit-panel-hint">Pasien terpilih</div>
                <div className="visit-selected-patient-name">{patient.name}</div>
                <div className="mono">{patient.jari_id}</div>
              </div>
            </div>
            <button
              type="button"
              className="jari-secondary-btn visit-change-btn"
              onClick={() => setPatient(null)}
            >
              <Icon name="edit" size={14} />
              Ganti pasien
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="jari-panel">
            <div className="visit-form-row">
              <Dropdown
                label="Metode identifikasi *"
                value={form.identification_method}
                onChange={(val) => update('identification_method', val)}
                options={identificationOptions}
              />

              <Dropdown
                label="Poliklinik (opsional)"
                value={form.polyclinic_id}
                onChange={(val) => update('polyclinic_id', val)}
                options={polyclinicOptions}
                placeholder={polyclinicsLoading ? 'Memuat…' : 'Pilih poliklinik'}
                disabled={polyclinicsLoading || polyclinics.length === 0}
                hint={polyclinicsError || undefined}
              />
            </div>

            <Dropdown
              label="Metode pembayaran *"
              value={form.payment_method}
              onChange={(val) => update('payment_method', val)}
              options={PAYMENT_OPTIONS}
            />
            {fieldErrors.payment_method && (
              <span className="field-error">{fieldErrors.payment_method[0]}</span>
            )}

            {form.payment_method === 'bpjs' && (
              <div className="field">
                <label htmlFor="bpjs_number">Nomor BPJS *</label>
                <input
                  id="bpjs_number"
                  value={form.bpjs_number}
                  onChange={(e) => update('bpjs_number', e.target.value)}
                  placeholder="0001234567890"
                />
                {fieldErrors.bpjs_number && (
                  <span className="field-error">{fieldErrors.bpjs_number[0]}</span>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="referral_letter_number">Nomor surat rujukan</label>
              <input
                id="referral_letter_number"
                value={form.referral_letter_number}
                onChange={(e) => update('referral_letter_number', e.target.value)}
                placeholder="Opsional"
              />
            </div>

            <div className="field">
              <label htmlFor="notes">Catatan</label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Catatan tambahan untuk petugas (opsional)"
              />
            </div>

            <button type="submit" className="jari-primary-btn visit-submit-btn" disabled={loading}>
              {loading ? (
                'Menyimpan…'
              ) : (
                <>
                  <Icon name="document" size={16} />
                  Daftarkan Kunjungan
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  )
}