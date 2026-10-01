import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPatient } from '../../api/patients.js'
import {
  extractErrorMessage,
  extractFieldErrors,
} from '../../utils/errors.js'
import './PatientRegister.css'

const initialForm = {
  nik: '',
  name: '',
  date_of_birth: '',
  gender: 'female',
  address: '',
  phone: '',
  insurance_provider: '',
  insurance_number: '',
}


/* =========================================================
   ICONS
   ========================================================= */

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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
    </svg>
  )
}


function ContactIcon({ size = 18 }) {
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
      <path d="M5 4h3l2 5-2 1.5c1 2 2.5 3.5 4.5 4.5L14 13l5 2v3c0 1.1-.9 2-2 2C10.4 20 4 13.6 4 7c0-1.7.4-3 1-3Z" />
    </svg>
  )
}


function ShieldIcon({ size = 18 }) {
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
      <path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}


function FingerprintIcon({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 7c-8 0-14 5.8-14 14" />
      <path d="M24 12c-5.2 0-9 3.7-9 9" />
      <path d="M24 17c-2.4 0-4 1.7-4 4 0 7.5-1.5 12.7-4.7 16" />
      <path d="M24 22c0 6.4-.7 12.4-4.2 17.3" />
      <path d="M29 38.5c2.8-4.5 4-9.5 4-16.5 0-5-3.8-9-9-9" />
      <path d="M34 37c2.5-4.7 3.5-9.7 3.5-15.5C37.5 13.5 31.6 7 24 7" />
      <path d="M29 43c4-5.5 5.8-12.5 5.8-20" />
      <path d="M13 31c.8 5 3.1 8.7 6.7 11.2" />
      <path d="M9 24c0 2.2.2 4.2.7 6" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
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
   COMPONENT
   ========================================================= */

export default function PatientRegister() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)

  const [fieldErrors, setFieldErrors] = useState({})

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const [created, setCreated] = useState(null)

  const [fingerprintStatus, setFingerprintStatus] =
    useState('waiting')

  const [scanning, setScanning] = useState(false)


  function update(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }


  /* =======================================================
     SIMULASI SCAN SIDIK JARI

     Nanti bagian ini bisa diganti dengan API/hardware
     fingerprint scanner yang sebenarnya.
     ======================================================= */

  function handleFingerprintScan() {
    setScanning(true)
    setFingerprintStatus('scanning')
    setError('')

    setTimeout(() => {
      setScanning(false)
      setFingerprintStatus('success')
    }, 1800)
  }


  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setFieldErrors({})
    setCreated(null)

    if (fingerprintStatus !== 'success') {
      setError(
        'Silakan daftarkan sidik jari pasien terlebih dahulu.'
      )
      return
    }

    setLoading(true)

    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        value === '' ? null : value,
      ])
    )

    try {
      const { data } = await createPatient(payload)

      setCreated(data.data)

      setForm(initialForm)

      setFingerprintStatus('waiting')

    } catch (err) {
      setError(extractErrorMessage(err))

      setFieldErrors(
        extractFieldErrors(err)
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="page patient-register-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="page-header">

        <h1>Daftarkan Pasien</h1>

        <p>
          Lengkapi data pasien dan daftarkan sidik jari
          sebagai identitas pasien di Jari Center.
        </p>

      </div>


      {/* =================================================
          SUCCESS
          ================================================= */}

      {created && (

        <div className="patient-created-card">

          <div className="created-left">

            <div className="created-icon">
              <CheckIcon size={21} />
            </div>

            <div>

              <span className="created-label">
                Pasien berhasil terdaftar
              </span>

              <strong className="created-name">
                {created.name}
              </strong>

              <span className="created-jari">
                Jari ID: {created.jari_id}
              </span>

            </div>

          </div>


          <button
            type="button"
            className="created-action"
            onClick={() =>
              navigate(
                '/kunjungan/baru',
                {
                  state: {
                    patient: created,
                  },
                }
              )
            }
          >

            <span>
              Daftarkan Kunjungan
            </span>

            <ArrowRightIcon size={17} />

          </button>

        </div>

      )}


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <div className="alert alert-error patient-register-error">
          {error}
        </div>

      )}


      {/* =================================================
          FORM
          ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="patient-form-card"
        noValidate
      >

        {/* =================================================
            DATA IDENTITAS
            ================================================= */}

        <section className="patient-form-section">

          <div className="form-section-header">

            <div className="form-section-icon identity">
              <UserIcon size={18} />
            </div>

            <div>

              <h2>
                Data Identitas
              </h2>

              <p>
                Informasi dasar pasien
              </p>

            </div>

          </div>


          <div className="patient-form-grid">

            <div className="field">

              <label htmlFor="name">
                Nama lengkap
                <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  update(
                    'name',
                    e.target.value
                  )
                }
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                required
              />

              {fieldErrors.name && (
                <span className="field-error">
                  {fieldErrors.name[0]}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="nik">
                NIK
              </label>

              <input
                id="nik"
                type="text"
                value={form.nik}
                onChange={(e) =>
                  update(
                    'nik',
                    e.target.value
                  )
                }
                inputMode="numeric"
                placeholder="Masukkan NIK pasien"
                maxLength={16}
              />

              {fieldErrors.nik && (
                <span className="field-error">
                  {fieldErrors.nik[0]}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="date_of_birth">
                Tanggal lahir
                <span>*</span>
              </label>

              <input
                id="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={(e) =>
                  update(
                    'date_of_birth',
                    e.target.value
                  )
                }
                required
              />

              {fieldErrors.date_of_birth && (
                <span className="field-error">
                  {fieldErrors.date_of_birth[0]}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="gender">
                Jenis kelamin
                <span>*</span>
              </label>

              <select
                id="gender"
                value={form.gender}
                onChange={(e) =>
                  update(
                    'gender',
                    e.target.value
                  )
                }
                required
              >

                <option value="female">
                  Perempuan
                </option>

                <option value="male">
                  Laki-laki
                </option>

              </select>

              {fieldErrors.gender && (
                <span className="field-error">
                  {fieldErrors.gender[0]}
                </span>
              )}

            </div>


            <div className="field field-full">

              <label htmlFor="address">
                Alamat
              </label>

              <textarea
                id="address"
                rows={3}
                value={form.address}
                onChange={(e) =>
                  update(
                    'address',
                    e.target.value
                  )
                }
                placeholder="Masukkan alamat lengkap pasien"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            SIDIK JARI
            ================================================= */}

        <section className="patient-form-section fingerprint-section">

          <div className="form-section-header">

            <div className="form-section-icon fingerprint">
              <FingerprintIcon size={19} />
            </div>

            <div>

              <h2>
                Identitas Sidik Jari
              </h2>

              <p>
                Daftarkan sidik jari pasien sebagai identitas Jari Center
              </p>

            </div>

          </div>


          <div className="fingerprint-card">

            <div
              className={`fingerprint-scanner ${
                fingerprintStatus === 'success'
                  ? 'success'
                  : fingerprintStatus === 'scanning'
                  ? 'scanning'
                  : ''
              }`}
            >

              <FingerprintIcon size={55} />

              {fingerprintStatus === 'success' && (
                <div className="fingerprint-check">
                  <CheckIcon size={13} />
                </div>
              )}

            </div>


            <div className="fingerprint-content">

              {fingerprintStatus === 'waiting' && (
                <>
                  <h3>
                    Sidik jari belum didaftarkan
                  </h3>

                  <p>
                    Pastikan data pasien sudah benar,
                    kemudian lakukan pemindaian sidik jari.
                  </p>

                  <button
                    type="button"
                    className="fingerprint-button"
                    onClick={handleFingerprintScan}
                    disabled={scanning}
                  >
                    <FingerprintIcon size={17} />
                    Daftarkan Sidik Jari
                  </button>
                </>
              )}


              {fingerprintStatus === 'scanning' && (
                <>
                  <h3>
                    Membaca sidik jari...
                  </h3>

                  <p>
                    Silakan letakkan jari pasien pada
                    scanner dan jangan dilepas.
                  </p>

                  <div className="fingerprint-progress">
                    <span />
                  </div>
                </>
              )}


              {fingerprintStatus === 'success' && (
                <>
                  <div className="fingerprint-success-label">
                    <CheckIcon size={14} />
                    Sidik jari berhasil didaftarkan
                  </div>

                  <h3>
                    Identitas jari siap digunakan
                  </h3>

                  <p>
                    Sidik jari pasien telah siap
                    dihubungkan dengan data pasien.
                  </p>

                  <button
                    type="button"
                    className="fingerprint-reset"
                    onClick={() => {
                      setFingerprintStatus('waiting')
                    }}
                  >
                    Scan ulang
                  </button>
                </>
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            INFORMASI KONTAK
            ================================================= */}

        <section className="patient-form-section">

          <div className="form-section-header">

            <div className="form-section-icon contact">
              <ContactIcon size={18} />
            </div>

            <div>

              <h2>
                Informasi Kontak
              </h2>

              <p>
                Data yang dapat digunakan untuk menghubungi pasien
              </p>

            </div>

          </div>


          <div className="patient-form-grid">

            <div className="field">

              <label htmlFor="phone">
                Nomor telepon
              </label>

              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  update(
                    'phone',
                    e.target.value
                  )
                }
                inputMode="tel"
                placeholder="Contoh: 081234567890"
              />

              {fieldErrors.phone && (
                <span className="field-error">
                  {fieldErrors.phone[0]}
                </span>
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            PENJAMIN
            ================================================= */}

        <section className="patient-form-section">

          <div className="form-section-header">

            <div className="form-section-icon insurance">
              <ShieldIcon size={18} />
            </div>

            <div>

              <h2>
                Data Penjamin
              </h2>

              <p>
                Informasi jaminan atau pembiayaan pasien
              </p>

            </div>

          </div>


          <div className="patient-form-grid">

            <div className="field">

              <label htmlFor="insurance_provider">
                Penjamin
              </label>

              <input
                id="insurance_provider"
                type="text"
                placeholder="BPJS / Mandiri / lainnya"
                value={form.insurance_provider}
                onChange={(e) =>
                  update(
                    'insurance_provider',
                    e.target.value
                  )
                }
              />

              {fieldErrors.insurance_provider && (
                <span className="field-error">
                  {fieldErrors.insurance_provider[0]}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="insurance_number">
                Nomor penjamin
              </label>

              <input
                id="insurance_number"
                type="text"
                value={form.insurance_number}
                onChange={(e) =>
                  update(
                    'insurance_number',
                    e.target.value
                  )
                }
                placeholder="Masukkan nomor penjamin"
              />

              {fieldErrors.insurance_number && (
                <span className="field-error">
                  {fieldErrors.insurance_number[0]}
                </span>
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="patient-form-footer">

          <div className="required-info">

            <span>*</span>
            Wajib diisi

          </div>


          <button
            type="submit"
            className="patient-submit-button"
            disabled={
              loading ||
              fingerprintStatus !== 'success'
            }
          >

            {loading
              ? 'Menyimpan…'
              : 'Simpan Pasien'}

            {!loading && (
              <ArrowRightIcon size={17} />
            )}

          </button>

        </div>

      </form>

    </div>
  )
}