import { useMemo, useState } from "react";
import {
  Search,
  FileText,
  Download,
  CalendarDays,
  ClipboardCheck,
  Users,
  Activity,
} from "lucide-react";

import { patients, examinations, schedules } from "../data/dummyData";

function Reports() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Semua");

  const filteredExaminations = useMemo(() => {
    const keyword = search.toLowerCase();

    return examinations.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.type.toLowerCase().includes(keyword) ||
        item.doctor.toLowerCase().includes(keyword);

      return matchesSearch;
    });
  }, [search]);

  const normalCount = examinations.filter(
    (item) => item.result === "Normal"
  ).length;

  const followUpCount = examinations.filter(
    (item) => item.result === "Perlu Pemeriksaan Lanjutan"
  ).length;

  return (
    <div className="reports-page">
      <div className="page-heading">
        <div>
          <h1>Laporan</h1>
          <p>
            Ringkasan data pasien dan pemeriksaan Jari Center.
          </p>
        </div>

        <button className="primary-button">
          <Download size={18} />
          Export Laporan
        </button>
      </div>

      {/* RINGKASAN */}
      <div className="reports-stats">
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Users size={21} />
          </div>

          <div>
            <span>Total Pasien</span>
            <strong>{patients.length}</strong>
            <small>Pasien terdaftar</small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <ClipboardCheck size={21} />
          </div>

          <div>
            <span>Total Pemeriksaan</span>
            <strong>{examinations.length}</strong>
            <small>Data pemeriksaan</small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>Total Jadwal</span>
            <strong>{schedules.length}</strong>
            <small>Jadwal pemeriksaan</small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Activity size={21} />
          </div>

          <div>
            <span>Pemeriksaan Normal</span>
            <strong>{normalCount}</strong>
            <small>Hasil normal</small>
          </div>
        </div>
      </div>

      {/* HASIL PEMERIKSAAN */}
      <div className="reports-grid">
        <div className="content-card report-summary-card">
          <div className="card-header">
            <div>
              <h3>Ringkasan Hasil Pemeriksaan</h3>
              <p>Distribusi hasil pemeriksaan pasien</p>
            </div>
          </div>

          <div className="result-summary">
            <div className="result-summary-item">
              <div className="result-summary-icon normal">
                <ClipboardCheck size={20} />
              </div>

              <div>
                <strong>{normalCount}</strong>
                <span>Normal</span>
              </div>
            </div>

            <div className="result-summary-item">
              <div className="result-summary-icon warning">
                <Activity size={20} />
              </div>

              <div>
                <strong>{followUpCount}</strong>
                <span>Perlu Pemeriksaan Lanjutan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card report-info-card">
          <div className="card-header">
            <div>
              <h3>Informasi Laporan</h3>
              <p>Periode data sistem</p>
            </div>
          </div>

          <div className="report-info-list">
            <div>
              <span>Periode</span>
              <strong>September 2026</strong>
            </div>

            <div>
              <span>Data pasien</span>
              <strong>{patients.length} pasien</strong>
            </div>

            <div>
              <span>Data pemeriksaan</span>
              <strong>{examinations.length} pemeriksaan</strong>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL LAPORAN */}
      <div className="content-card reports-table-card">
        <div className="reports-toolbar">
          <div className="reports-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Cari pasien, ID, jenis pemeriksaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="reports-filter"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="Semua">Semua Periode</option>
            <option value="September 2026">
              September 2026
            </option>
            <option value="Agustus 2026">
              Agustus 2026
            </option>
          </select>

          <span className="reports-total">
            {filteredExaminations.length} laporan
          </span>
        </div>

        <div className="table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Pasien</th>
                <th>ID Pemeriksaan</th>
                <th>Tanggal</th>
                <th>Jenis Pemeriksaan</th>
                <th>Hasil</th>
                <th>Dokter</th>
              </tr>
            </thead>

            <tbody>
              {filteredExaminations.length > 0 ? (
                filteredExaminations.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="report-patient">
                        <div className="report-avatar">
                          <FileText size={17} />
                        </div>

                        <strong>{item.patientName}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="report-id">
                        {item.id}
                      </span>
                    </td>

                    <td>{item.date}</td>

                    <td>{item.type}</td>

                    <td>
                      <span
                        className={
                          item.result === "Normal"
                            ? "report-result normal"
                            : "report-result warning"
                        }
                      >
                        {item.result}
                      </span>
                    </td>

                    <td>{item.doctor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="report-empty"
                  >
                    <FileText size={28} />
                    <strong>Laporan tidak ditemukan</strong>
                    <span>
                      Coba gunakan kata kunci lain.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;