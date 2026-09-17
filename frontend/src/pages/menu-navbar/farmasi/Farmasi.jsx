import { Pill } from "lucide-react";
import ComingSoon from "../../../components/ComingSoon/ComingSoon";

function Farmasi() {
  return (
    <ComingSoon
      icon={Pill}
      title="Farmasi"
      subtitle="Resep dan stok obat"
      description="Halaman ini akan menampilkan daftar resep aktif dan status penyerahan obat begitu endpoint farmasi tersedia di backend."
      apiHint="GET /api/prescriptions"
    />
  );
}

export default Farmasi;