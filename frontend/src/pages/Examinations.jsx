import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ClipboardCheck,
  MoreVertical,
} from "lucide-react";

import { examinations } from "../data/dummyData";

function Examinations() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filteredExaminations = useMemo(() => {
    const keyword = search.toLowerCase();

    return examinations.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.type.toLowerCase().includes(keyword) ||
        item.doctor.toLowerCase().includes(keyword);

      const matchesFilter =
        filter === "Semua" || item.result === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="examinations-page">

      {/* HEADER */}
      <div className="page-heading">
        <div>
          <h1>Pemeriksaan</h1>
          <p>Kelola data pemeriksaan pasien Jari Center.</p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Tambah Pemeriksaan
        </button>
      </div>

      {/* CARD */}
      <div className="content-card examinations-card">

        {/* TOOLBAR */}
        <div className="examinations-toolbar">

          <div className="examinations-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Cari pasien, ID, jenis pemeriksaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="examination-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Semua">Semua Hasil</option>
            <option value="Normal">Normal</option>
            <option value="Perlu Pemeriksaan Lanjutan">
              Perlu Pemeriksaan Lanjutan
            </option>
          </select>

          <span className="examination-total">
            {filteredExaminations.length} pemeriksaan
          </span>

        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="examinations-table">

            <thead>
              <tr>
                <th>Pasien</th>
                <th>ID Pemeriksaan</th>
                <th>Tanggal</th>
                <th>Jenis Pemeriksaan</th>
                <th>Hasil</th>
                <th>Dokter</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredExaminations.length > 0 ? (
                filteredExaminations.map((item) => (
                  <tr key={item.id}>

                    <td>
                      <div className="examination-patient">
                        <div className="examination-avatar">
                          <ClipboardCheck size={18} />
                        </div>

                        <strong>{item.patientName}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="examination-id">
                        {item.id}
                      </span>
                    </td>

                    <td>{item.date}</td>

                    <td>{item.type}</td>

                    <td>
                      <span
                        className={
                          item.result === "Normal"
                            ? "result-badge normal"
                            : "result-badge warning"
                        }
                      >
                        {item.result}
                      </span>
                    </td>

                    <td>{item.doctor}</td>

                    <td>
                      <button className="action-button">
                        <MoreVertical size={18} />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table">
                    <ClipboardCheck size={28} />

                    <strong>
                      Pemeriksaan tidak ditemukan
                    </strong>

                    <span>
                      Coba gunakan kata kunci atau filter lain.
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

export default Examinations;