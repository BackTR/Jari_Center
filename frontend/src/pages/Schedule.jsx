import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  MoreVertical,
  Clock3,
} from "lucide-react";

import { schedules } from "../data/dummyData";

function Schedule() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filteredSchedules = useMemo(() => {
    const keyword = search.toLowerCase();

    return schedules.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.type.toLowerCase().includes(keyword) ||
        item.date.includes(keyword);

      const matchesFilter =
        filter === "Semua" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="schedule-page">
      <div className="page-heading">
        <div>
          <h1>Jadwal</h1>
          <p>
            Kelola jadwal pemeriksaan pasien Jari Center.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Tambah Jadwal
        </button>
      </div>

      <div className="content-card schedule-card">
        <div className="schedule-toolbar">
          <div className="schedule-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Cari pasien, ID jadwal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="schedule-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="Terjadwal">Terjadwal</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>

          <span className="schedule-total">
            {filteredSchedules.length} jadwal
          </span>
        </div>

        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Pasien</th>
                <th>ID Jadwal</th>
                <th>Tanggal</th>
                <th>Jenis Pemeriksaan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="schedule-time-cell">
                        <div className="schedule-time-icon">
                          <Clock3 size={17} />
                        </div>

                        <strong>{item.time}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="schedule-patient">
                        <div className="schedule-avatar">
                          <CalendarDays size={17} />
                        </div>

                        <strong>{item.patientName}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="schedule-id">
                        {item.id}
                      </span>
                    </td>

                    <td>{item.date}</td>

                    <td>{item.type}</td>

                    <td>
                      <span
                        className={`schedule-status ${
                          item.status === "Terjadwal"
                            ? "scheduled"
                            : item.status === "Selesai"
                            ? "completed"
                            : "cancelled"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <button className="schedule-action-button">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="schedule-empty"
                  >
                    <CalendarDays size={28} />

                    <strong>Jadwal tidak ditemukan</strong>

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

export default Schedule;