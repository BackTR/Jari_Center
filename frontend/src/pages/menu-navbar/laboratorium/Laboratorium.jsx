import { FlaskConical } from "lucide-react";
import ComingSoon from "../../../components/ComingSoon/ComingSoon";

function Laboratorium() {
  return (
    <ComingSoon
      icon={FlaskConical}
      title="Laboratorium"
      subtitle="Permintaan dan hasil pemeriksaan lab"
      description="Halaman ini akan menampilkan daftar permintaan pemeriksaan lab beserta hasilnya begitu endpoint laboratorium tersedia di backend."
      apiHint="GET /api/lab-results"
    />
  );
}

export default Laboratorium;