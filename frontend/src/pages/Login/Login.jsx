import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  extractErrorMessage,
  extractFieldErrors,
} from '../../utils/errors.js'
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  FingerprintIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
} from '../../components/icons.jsx'
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
              <FingerprintIcon />
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
                    <ArrowRightIcon />
                  </>
                )}

              </button>

            </form>


            {/* Footer */}

            <div className="login-security">

              <ShieldIcon />

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
   HELPERS
   ================================================== */
