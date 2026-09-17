import { useState } from "react";
import { ClipboardList, Search, Loader2, AlertCircle, User } from "lucide-react";
import { identifyPatient } from "../../../services/api";
import "../../../styles/Pagecommon.css";

// Halaman ini sudah connect ke API asli (identifyPatient di api.js),
// beda dengan halaman lain (Antrian, Billing, dst.) yang masih ComingSoon
// karena endpoint-nya belum ada di backend.
function Rekammedis() {
  const [type, setType] = useState("keyword"); // "keyword" | "nik" | "jari_id"
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null); // null = belum pernah cari

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const data = await identifyPatient(type, query.trim());
      setResults(data);
    } catch (err) {
      setError(err.message || "Gagal mencari data pasien.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ClipboardList size={22} />
            Rekam Medis
          </h1>
          <p className="page-subtitle">
            Cari pasien berdasarkan NIK atau nama untuk membuka riwayat rekam medisnya
          </p>
        </div>
      </div>

      <div className="page-card">
        <form className="page-form" onSubmit={handleSearch}>
          <div className="page-field">
            <label htmlFor="rm-type">Cari berdasarkan</label>
            <select
              id="rm-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="keyword">Nama</option>
              <option value="nik">NIK</option>
            </select>
          </div>

          <div className="page-field">
            <label htmlFor="rm-query">
              {type === "nik" ? "Nomor NIK" : "Nama pasien"}
            </label>
            <input
              id="rm-query"
              type="text"
              placeholder={type === "nik" ? "Masukkan NIK" : "Masukkan nama pasien"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          <div className="page-form-actions">
            <button type="submit" className="page-btn page-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="page-spinner" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Cari Pasien
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="page-alert page-alert-error" style={{ marginTop: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Belum pernah cari -> jangan tampilkan apa-apa di bawah form */}

        {results && results.length === 0 && (
          <div className="page-empty-state" style={{ padding: "32px 0" }}>
            <p>Tidak ada pasien yang cocok dengan pencarian ini.</p>
          </div>
        )}

        {results && results.length > 0 && (
          <ul className="rm-result-list">
            {results.map((p) => (
              <li key={p.id} className="rm-result-item">
                <span className="rm-result-avatar">
                  <User size={18} />
                </span>
                <div className="rm-result-info">
                  <strong>{p.name}</strong>
                  <span>
                    {p.nik ? `NIK: ${p.nik}` : ""}
                    {p.nik && p.medical_record_number ? " • " : ""}
                    {p.medical_record_number ? `RM: ${p.medical_record_number}` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="page-btn page-btn-secondary rm-result-action"
                  onClick={() => {
                    // Arahkan ke halaman detail rekam medis pasien ini kalau sudah ada rute-nya
                    // navigate(`/rekam-medis/${p.id}`);
                  }}
                >
                  Buka
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Rekammedis;