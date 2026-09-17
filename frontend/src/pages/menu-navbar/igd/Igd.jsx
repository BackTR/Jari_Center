import { Siren } from "lucide-react";
import ComingSoon from "../../../components/ComingSoon/ComingSoon";

function Igd() {
  return (
    <ComingSoon
      icon={Siren}
      title="IGD"
      subtitle="Mode gawat darurat"
      description="Halaman ini akan menampilkan daftar pasien IGD dengan prioritas triase begitu alur IGD tersedia di backend. Kemungkinan bisa dibangun dari endpoint /visits yang sudah ada, dengan tambahan flag prioritas."
      apiHint="POST/GET /api/visits (mode IGD)"
    />
  );
}

export default Igd;