import "../../styles/Pagecommon.css";

/**
 * Placeholder standar buat halaman modul yang layout-nya sudah jadi
 * tapi backend-nya belum ada endpoint untuk itu.
 * Begitu endpoint-nya siap, ganti isi <ComingSoon /> di masing-masing
 * halaman dengan tampilan data asli (lihat Rekammedis.jsx atau
 * Registrasipasien.jsx sebagai contoh halaman yang sudah connect ke API).
 */
export default function ComingSoon({ icon: Icon, title, subtitle, description, apiHint }) {
  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {Icon && <Icon size={22} />}
            {title}
          </h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="page-card">
        <div className="page-empty-state">
          <div className="page-empty-icon">{Icon && <Icon size={28} />}</div>
          <h3>Belum terhubung ke backend</h3>
          <p>{description}</p>
          {apiHint && (
            <span className="page-empty-note">Menunggu endpoint: {apiHint}</span>
          )}
        </div>
      </div>
    </div>
  );
}