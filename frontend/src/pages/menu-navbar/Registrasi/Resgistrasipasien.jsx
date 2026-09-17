import { useState } from "react";
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createPatient } from "../../../services/api";
import "../../../styles/Pagecommon.css";

// Halaman ini sudah connect ke API asli (createPatient di api.js).
// Catatan penamaan file: sebelumnya file ini bernama "Resgistrasipasien.jsx"
// (hurufnya kebalik), aku ganti jadi "Registrasipasien.jsx" di sini —
// tinggal rename filenya di project kamu + sesuaikan importnya di App.jsx.

const initialForm = {
  name: "",
  nik: "",
  date_of_birth: "",
  gender: "",
  address: "",
  phone: "",
  insurance_provider: "",
  insurance_number: "",
};

function Registrasipasien() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess(false);
    setLoading(true);

    // Buang field opsional yang masih kosong supaya tidak dikirim sebagai
    // string kosong ke backend (biar validasi "nullable" di Laravel jalan normal)
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== "")
    );

    try {
      await createPatient(payload);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Gagal menyimpan data pasien.");
      if (err.errors) setFieldErrors(err.errors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserPlus size={22} />
            Registrasi Pasien
          </h1>
          <p className="page-subtitle">
            Daftarkan pasien baru sebelum melanjutkan ke proses kunjungan
          </p>
        </div>
      </div>

      <div className="page-card">
        {error && (
          <div className="page-alert page-alert-error" style={{ marginBottom: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="page-alert page-alert-success" style={{ marginBottom: 16 }}>
            <CheckCircle2 size={16} />
            <span>Pasien berhasil didaftarkan.</span>
          </div>
        )}

        <form className="page-form" onSubmit={handleSubmit}>
          <div className="page-field">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && (
              <span className="field-error-text">{fieldErrors.name[0]}</span>
            )}
          </div>

          <div className="page-field">
            <label htmlFor="nik">
              NIK <span className="optional">(opsional)</span>
            </label>
            <input
              id="nik"
              name="nik"
              type="text"
              maxLength={16}
              value={form.nik}
              onChange={handleChange}
            />
            {fieldErrors.nik && (
              <span className="field-error-text">{fieldErrors.nik[0]}</span>
            )}
          </div>

          <div className="page-field">
            <label htmlFor="date_of_birth">Tanggal Lahir</label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
              required
            />
            {fieldErrors.date_of_birth && (
              <span className="field-error-text">{fieldErrors.date_of_birth[0]}</span>
            )}
          </div>

          <div className="page-field">
            <label htmlFor="gender">Jenis Kelamin</label>
            {/* Sesuaikan value "male"/"female" ini dengan enum yang dipakai backend kamu */}
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
            {fieldErrors.gender && (
              <span className="field-error-text">{fieldErrors.gender[0]}</span>
            )}
          </div>

          <div className="page-field">
            <label htmlFor="phone">
              No. Telepon <span className="optional">(opsional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && (
              <span className="field-error-text">{fieldErrors.phone[0]}</span>
            )}
          </div>

          <div className="page-field">
            <label htmlFor="insurance_provider">
              Provider Asuransi <span className="optional">(opsional)</span>
            </label>
            <input
              id="insurance_provider"
              name="insurance_provider"
              type="text"
              placeholder="mis. BPJS Kesehatan"
              value={form.insurance_provider}
              onChange={handleChange}
            />
          </div>

          <div className="page-field">
            <label htmlFor="insurance_number">
              No. Asuransi <span className="optional">(opsional)</span>
            </label>
            <input
              id="insurance_number"
              name="insurance_number"
              type="text"
              value={form.insurance_number}
              onChange={handleChange}
            />
          </div>

          <div className="page-field page-form-full">
            <label htmlFor="address">
              Alamat <span className="optional">(opsional)</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="page-form-actions">
            <button type="submit" className="page-btn page-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="page-spinner" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Pasien"
              )}
            </button>
            <button
              type="button"
              className="page-btn page-btn-secondary"
              onClick={() => setForm(initialForm)}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registrasipasien;