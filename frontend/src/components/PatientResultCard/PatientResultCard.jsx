import './PatientResultCard.css'


/* =========================================================
   ICONS
   ========================================================= */

function UserIcon({ size = 22 }) {
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


function CalendarIcon({ size = 17 }) {
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
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}


function PhoneIcon({ size = 17 }) {
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


function ShieldIcon({ size = 17 }) {
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


function MapPinIcon({ size = 17 }) {
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
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}


function FingerprintIcon({ size = 17 }) {
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
    </svg>
  )
}


function ArrowRightIcon({ size = 18 }) {
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
    return words[0].slice(0, 2).toUpperCase()
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase()
}


function formatDate(date) {
  if (!date) {
    return '-'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  )
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function PatientResultCard({
  patient,
  onStartVisit,
}) {

  const name =
    patient?.name ||
    'Nama pasien'


  const jariId =
    patient?.jari_id ||
    patient?.jariId ||
    '-'


  const nik =
    patient?.nik ||
    '-'


  const birthDate =
    patient?.birth_date ||
    patient?.tanggal_lahir ||
    patient?.date_of_birth ||
    null


  const gender =
    patient?.gender ||
    patient?.jenis_kelamin ||
    '-'


  const phone =
    patient?.phone ||
    patient?.telephone ||
    patient?.telepon ||
    '-'


  const insurance =
    patient?.insurance ||
    patient?.penjamin ||
    patient?.insurance_name ||
    '-'


  const address =
    patient?.address ||
    patient?.alamat ||
    '-'


  /*
   * Bisa menerima beberapa kemungkinan nama
   * field foto dari backend.
   */
  const photoUrl =
    patient?.photo_url ||
    patient?.photo ||
    patient?.face_photo_url ||
    patient?.photo_path ||
    null


  const isActive =
    patient?.is_active !== false


  return (
    <article className="patient-result-card">

      {/* ===================================================
          BAGIAN ATAS
          =================================================== */}

      <div className="patient-card-main">

        {/* =================================================
            FOTO
            ================================================= */}

        <div className="patient-photo">

          {photoUrl ? (

            <img
              src={photoUrl}
              alt={`Foto ${name}`}
            />

          ) : (

            <div className="patient-photo-placeholder">

              <UserIcon size={36} />

              <span>
                {getInitials(name)}
              </span>

            </div>

          )}

        </div>


        {/* =================================================
            DATA UTAMA
            ================================================= */}

        <div className="patient-main-info">

          <div className="patient-name-row">

            <div>

              <h2>
                {name}
              </h2>

              <div className="patient-jari-id">

                <FingerprintIcon size={15} />

                <span>
                  {jariId}
                </span>

              </div>

            </div>


            <span
              className={`patient-status ${
                isActive
                  ? 'active'
                  : 'inactive'
              }`}
            >

              <span className="status-dot" />

              {isActive
                ? 'Pasien Aktif'
                : 'Tidak Aktif'
              }

            </span>

          </div>


          {/* ===============================================
              DATA GRID
              =============================================== */}

          <div className="patient-data-grid">

            <div className="patient-data-item">

              <span className="patient-data-label">
                NIK
              </span>

              <span className="patient-data-value">
                {nik}
              </span>

            </div>


            <div className="patient-data-item">

              <span className="patient-data-label">
                Tanggal Lahir
              </span>

              <span className="patient-data-value">
                {formatDate(birthDate)}
              </span>

            </div>


            <div className="patient-data-item">

              <span className="patient-data-label">
                Jenis Kelamin
              </span>

              <span className="patient-data-value">
                {gender}
              </span>

            </div>


            <div className="patient-data-item">

              <span className="patient-data-label">
                Telepon
              </span>

              <span className="patient-data-value">
                {phone}
              </span>

            </div>


            <div className="patient-data-item">

              <span className="patient-data-label">
                Penjamin
              </span>

              <span className="patient-data-value">
                {insurance}
              </span>

            </div>


            <div className="patient-data-item patient-address">

              <span className="patient-data-label">
                Alamat
              </span>

              <span className="patient-data-value">
                {address}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================
          FOOTER CARD
          =================================================== */}

      <div className="patient-card-footer">

        <div className="patient-found-info">

          <span className="patient-found-icon">
            <ShieldIcon size={16} />
          </span>

          <div>

            <strong>
              Data pasien ditemukan
            </strong>

            <span>
              Identitas berhasil ditemukan dalam sistem.
            </span>

          </div>

        </div>


        <button
          type="button"
          className="patient-visit-button"
          onClick={() => onStartVisit(patient)}
        >

          <span>
            Daftarkan Kunjungan
          </span>

          <ArrowRightIcon size={17} />

        </button>

      </div>

    </article>
  )
}