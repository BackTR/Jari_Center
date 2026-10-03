import {
  ArrowRightIcon,
  FingerprintIcon,
  ShieldIcon,
  UserIcon,
} from '../icons.jsx'
import { formatDate } from '../../utils/date.js'
import './PatientResultCard.css'


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