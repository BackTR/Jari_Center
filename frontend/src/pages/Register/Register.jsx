import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerAccount } from '../../api/auth.js'
import { extractErrorMessage, extractFieldErrors } from '../../utils/errors.js'
import './Register.css'

import logoJariCenter from '../../assets/logo/jari_center.png'

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (password !== passwordConfirmation) {
      setFieldErrors({ password_confirmation: ['Konfirmasi kata sandi tidak cocok.'] })
      return
    }

    setLoading(true)
    try {
      await registerAccount({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      setSuccess(true)
    } catch (err) {
      setError(extractErrorMessage(err))
      setFieldErrors(extractFieldErrors(err))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-screen">
        <div className="login-bg-shape login-bg-shape--one"></div>
        <div className="login-bg-shape login-bg-shape--two"></div>

        <div className="auth-success-card">
          <div className="auth-success-icon">
            <CheckIcon />
          </div>

          <h1>Akun berhasil dibuat</h1>
          <p>
            Akun Anda sudah terdaftar. Silakan masuk menggunakan email
            dan kata sandi yang baru saja Anda buat.
          </p>

          <button
            type="button"
            className="login-submit"
            onClick={() => navigate('/login')}
          >
            Masuk sekarang
            <ArrowIcon />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-screen">

      <div className="login-bg-shape login-bg-shape--one"></div>
      <div className="login-bg-shape login-bg-shape--two"></div>
      <div className="login-bg-shape login-bg-shape--three"></div>

      <div className="login-container login-container--single">

        <div className="login-form-panel">

          <div className="login-card">

            <img
              src={logoJariCenter}
              alt="Jari Center"
              className="login-mobile-logo login-mobile-logo--always"
            />

            <div className="login-header">
              <div className="login-welcome">BERGABUNG DENGAN KAMI</div>
              <h1>Buat Akun Baru</h1>
              <p>
                Daftar sebagai pasien maupun petugas fasilitas kesehatan
                untuk mulai menggunakan Jari Center.
              </p>
            </div>

            {error && (
              <div className="login-alert">
                <div className="login-alert-icon">!</div>
                <div>
                  <strong>Gagal mendaftar</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="login-form">

              <div className="login-field">
                <label htmlFor="name">Nama lengkap</label>
                <div className={`login-input-wrapper ${fieldErrors.name ? 'login-input-wrapper--error' : ''}`}>
                  <span className="login-input-icon"><UserIcon /></span>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama sesuai identitas"
                    autoComplete="name"
                    required
                  />
                </div>
                {fieldErrors.name && <span className="login-field-error">{fieldErrors.name[0]}</span>}
              </div>

              <div className="login-field">
                <label htmlFor="email">Email</label>
                <div className={`login-input-wrapper ${fieldErrors.email ? 'login-input-wrapper--error' : ''}`}>
                  <span className="login-input-icon"><MailIcon /></span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="username"
                    required
                  />
                </div>
                {fieldErrors.email && <span className="login-field-error">{fieldErrors.email[0]}</span>}
              </div>

              <div className="login-field">
                <label htmlFor="password">Kata sandi</label>
                <div className={`login-input-wrapper ${fieldErrors.password ? 'login-input-wrapper--error' : ''}`}>
                  <span className="login-input-icon"><LockIcon /></span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldErrors.password && <span className="login-field-error">{fieldErrors.password[0]}</span>}
              </div>

              <div className="login-field">
                <label htmlFor="password_confirmation">Konfirmasi kata sandi</label>
                <div className={`login-input-wrapper ${fieldErrors.password_confirmation ? 'login-input-wrapper--error' : ''}`}>
                  <span className="login-input-icon"><LockIcon /></span>
                  <input
                    id="password_confirmation"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    autoComplete="new-password"
                    required
                  />
                </div>
                {fieldErrors.password_confirmation && (
                  <span className="login-field-error">{fieldErrors.password_confirmation[0]}</span>
                )}
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    Buat Akun
                    <ArrowIcon />
                  </>
                )}
              </button>

            </form>

            <div className="login-register-row">
              Sudah punya akun?
              <Link to="/login" className="login-register-link">Masuk di sini</Link>
            </div>

          </div>

          <div className="login-copyright">
            Jari Center · Digital Health Identity &amp; Patient Administration Platform
          </div>

        </div>

      </div>
    </div>
  )
}


/* ================== ICONS ================== */

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1-4 3.6-6.2 7.5-6.2s6.5 2.2 7.5 6.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8 12.5 2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}