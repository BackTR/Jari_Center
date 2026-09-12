import { UserRound } from "lucide-react";

function RecentPatients({ patients }) {
  return (
    <div className="content-card">
      <div className="card-header">
        <div>
          <h3>Pasien Terbaru</h3>
          <p>Daftar pasien yang terdaftar</p>
        </div>
      </div>

      <div className="patient-list">
        {patients.map((patient) => (
          <div className="patient-item" key={patient.id}>
            <div className="patient-avatar">
              <UserRound size={19} />
            </div>

            <div className="patient-info">
              <strong>{patient.name}</strong>
              <span>
                {patient.gender} • {patient.age} tahun
              </span>
            </div>

            <span className="patient-id">{patient.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentPatients;