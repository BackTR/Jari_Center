import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../../api/auth.js'
import { extractErrorMessage, extractFieldErrors } from '../../utils/errors.js'
import './ForgotPassword.css'

import logoJariCenter from '../../assets/logo/jari_center.png'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(extractErrorMessage(err))
      setFieldErrors(extractFieldErrors(err))
    } finally {
      setLoading(false)
    }
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

            {!sent ? (
              <>
                <div className="login-header">
                  <div className="login-welcome">PEMULIHAN AKUN</div>
                  <h1>Lupa Kata Sandi</h1>
                  <p>
                    Masukkan email akun Anda. Kami akan mengirimkan
                    tautan untuk membuat kata sandi baru.
                  </p>
                </div>

                {error && (
                  <div className="login-alert">
                    <div className="login-alert-icon">!</div>
                    <div>
                      <strong>Gagal mengirim tautan</strong>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="login-form">
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

                  <button type="submit" className="login-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="login-spinner"></span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Tautan Reset
                        <ArrowIcon />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="forgot-sent">
                <div className="auth-success-icon">
                  <MailSentIcon />
                </div>
                <h1>Cek email Anda</h1>
                <p>
                  Kami sudah mengirimkan tautan reset kata sandi ke{' '}
                  <strong>{email}</strong>. Buka email tersebut untuk
                  melanjutkan.
                </p>
              </div>
            )}

            <div className="login-register-row">
              Ingat kata sandi Anda?
              <Link to="/login" className="login-register-link">Kembali masuk</Link>
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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MailSentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m15 15.5 2 2 3.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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