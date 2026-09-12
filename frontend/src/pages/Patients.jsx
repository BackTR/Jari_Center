import { useMemo, useState } from "react";
import { 
  Search,
  Plus,
  UserRound,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { patients } from "../data/dummyData";

function Patients() {
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
    const keyword = search.toLowerCase();

    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(keyword) ||
        patient.id.toLowerCase().includes(keyword) ||
        patient.phone.includes(keyword)
    );
  }, [search]);

  return (
    <div className="patients-page">
      {/* HEADER */}
      <div className="page-heading">
        <div>
          <h1>Data Pasien</h1>
          <p>Kelola data pasien Jari Center.</p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Tambah Pasien
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="content-card patients-card">
        <div className="patients-toolbar">
          <div className="patients-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari nama, ID pasien, atau nomor HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span className="patient-total">
            {filteredPatients.length} pasien
          </span>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Pasien</th>
                <th>ID Pasien</th>
                <th>Gender</th>
                <th>Umur</th>
                <th>No. HP</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="table-patient">
                        <div className="table-patient-avatar">
                          <UserRound size={18} />
                        </div>

                        <strong>{patient.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="patient-id-table">
                        {patient.id}
                      </span>
                    </td>

                    <td>{patient.gender}</td>

                    <td>{patient.age} tahun</td>

                    <td>{patient.phone}</td>

                    <td>{patient.address}</td>

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
                    <UserRound size={28} />
                    <strong>Pasien tidak ditemukan</strong>
                    <span>
                      Coba gunakan kata kunci pencarian yang berbeda.
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

export default Patients;