import { CalendarDays } from "lucide-react";
import ComingSoon from "../../../components/ComingSoon/ComingSoon";

function Antrian() {
  return (
    <ComingSoon
      icon={CalendarDays}
      title="Antrian"
      subtitle="Daftar antrean pasien per poli"
      description="Halaman ini akan menampilkan daftar antrean pasien secara real-time (nomor antrean, poli tujuan, status) begitu endpoint antrean tersedia di backend."
      apiHint="GET /api/queues"
    />
  );
}

export default Antrian;