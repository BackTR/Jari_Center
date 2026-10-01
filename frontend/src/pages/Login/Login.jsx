import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  extractErrorMessage,
  extractFieldErrors,
} from '../../utils/errors.js'
import './Login.css'

import logoJariCenter from '../../assets/logo/jari_center.png'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo =
    location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      await login(email, password)

      navigate(redirectTo, {
        replace: true,
      })
    } catch (err) {
      setError(extractErrorMessage(err))
      setFieldErrors(extractFieldErrors(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">

      {/* Background decoration */}
      <div className="login-bg-shape login-bg-shape--one"></div>
      <div className="login-bg-shape login-bg-shape--two"></div>
      <div className="login-bg-shape login-bg-shape--three"></div>


      {/* Main container */}
      <div className="login-container">

        {/* ================= LEFT BRAND ================= */}

        <div className="login-brand-panel">

          <div className="login-brand-content">

            <div className="login-brand-badge">
              <span className="login-brand-dot"></span>
              DIGITAL HEALTH IDENTITY
            </div>

            <div className="login-brand-logo-wrap">
              <img
                src={logoJariCenter}
                alt="Jari Center"
                className="login-brand-logo"
              />
            </div>

            <h2>
              Satu Jari.
              <br />
              Satu Identitas.
              <br />
              <span>Pelayanan Kesehatan Lebih Cepat.</span>
            </h2>

            <p className="login-brand-description">
              Jari Center menghubungkan pasien dan fasilitas
              kesehatan dalam satu identitas digital — cepat,
              aman, dan terintegrasi untuk semua pengguna.
            </p>


            {/* Feature mini cards */}

            <div className="login-features">

              <div className="login-feature">
                <div className="login-feature-icon">
                  <FingerprintIcon />
                </div>

                <div>
                  <strong>Identitas Digital</strong>
                  <span>Dikenali di mana saja</span>
                </div>
              </div>


              <div className="login-feature">
                <div className="login-feature-icon">
                  <ShieldIcon />
                </div>

                <div>
                  <strong>Data Terlindungi</strong>
                  <span>Akses aman dan terkontrol</span>
                </div>
              </div>

            </div>

          </div>


          {/* Decorative fingerprint */}

          <div className="login-brand-decoration">
            <div className="fingerprint-ring fingerprint-ring--1"></div>
            <div className="fingerprint-ring fingerprint-ring--2"></div>
            <div className="fingerprint-ring fingerprint-ring--3"></div>

            <div className="fingerprint-center">
              <FingerprintLargeIcon />
            </div>
          </div>

        </div>


        {/* ================= LOGIN CARD ================= */}

        <div className="login-form-panel">

          <div className="login-card">

            {/* Mobile logo */}
            <img
              src={logoJariCenter}
              alt="Jari Center"
              className="login-mobile-logo"
            />


            {/* Header */}

            <div className="login-header">

              <div className="login-welcome">
                SELAMAT DATANG
              </div>

              <h1>
                Masuk ke Jari Center
              </h1>

              <p>
                Satu akun untuk pasien dan petugas fasilitas
                kesehatan — masuk untuk mulai menggunakan Jari Center.
              </p>

            </div>


            {/* Error */}

            {error && (
              <div className="login-alert">
                <div className="login-alert-icon">
                  !
                </div>

                <div>
                  <strong>Gagal masuk</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="login-form"
            >

              {/* Email */}

              <div className="login-field">

                <label htmlFor="email">
                  Email
                </label>

                <div
                  className={`login-input-wrapper ${
                    fieldErrors.email
                      ? 'login-input-wrapper--error'
                      : ''
                  }`}
                >

                  <span className="login-input-icon">
                    <MailIcon />
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="nama@email.com"
                    autoComplete="username"
                    required
                  />

                </div>

                {fieldErrors.email && (
                  <span className="login-field-error">
                    {fieldErrors.email[0]}
                  </span>
                )}

              </div>


              {/* Password */}

              <div className="login-field">

                <div className="login-label-row">

                  <label htmlFor="password">
                    Kata sandi
                  </label>

                </div>


                <div
                  className={`login-input-wrapper ${
                    fieldErrors.password
                      ? 'login-input-wrapper--error'
                      : ''
                  }`}
                >

                  <span className="login-input-icon">
                    <LockIcon />
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    required
                  />


                  {/* Eye button */}

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Sembunyikan kata sandi'
                        : 'Tampilkan kata sandi'
                    }
                    title={
                      showPassword
                        ? 'Sembunyikan kata sandi'
                        : 'Tampilkan kata sandi'
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>

                </div>

                {fieldErrors.password && (
                  <span className="login-field-error">
                    {fieldErrors.password[0]}
                  </span>
                )}

              </div>


              {/* Submit */}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk
                    <ArrowIcon />
                  </>
                )}

              </button>

            </form>


            {/* Footer */}

            <div className="login-security">

              <ShieldSmallIcon />

              <span>
                Sistem aman · Data Anda terlindungi
              </span>

            </div>

          </div>


          <div className="login-copyright">
            Jari Center · Digital Health Identity &amp;
            Patient Administration Platform
          </div>

        </div>

      </div>

    </div>
  )
}


/* ==================================================
   ICONS
================================================== */

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 6.2A9.5 9.5 0 0 1 12 6c6.1 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 6.9C3.9 8.3 2.5 12 2.5 12s3.4 6 9.5 6c1.2 0 2.3-.2 3.3-.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FingerprintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4a7 7 0 0 0-7 7c0 2.3.2 4.5 1.2 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 7a4 4 0 0 0-4 4c0 3.3.2 5.2 1.2 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 10a1 1 0 0 0-1 1c0 4.2.8 6.9 2 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 8.5a6 6 0 0 1 2 4.5c0 3.2.5 5.4 1.5 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function FingerprintLargeIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 17C31.8 17 17 31.8 17 50c0 8.5 1.1 16.5 5.5 23.8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 29c-11.6 0-21 9.4-21 21 0 10.5 1.3 18.7 5.3 25.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 41c-5 0-9 4-9 9 0 14.5 2.5 22.7 6.8 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M65 32c5.8 5 9 11.8 9 20 0 10.7 1.7 19.5 5.2 25.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M74 27c7.8 7.1 12 15.8 12 26 0 10.2 1.5 17.5 4 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l7 3v5.5c0 4.5-2.8 7.7-7 9.5-4.2-1.8-7-5-7-9.5V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5l6.5 2.8v5.1c0 4.1-2.6 7-6.5 8.9-3.9-1.9-6.5-4.8-6.5-8.9V6.3L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9 11.7 2 2 4-4.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}