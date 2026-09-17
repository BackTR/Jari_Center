import { Settings } from "lucide-react";
import ComingSoon from "../../../components/ComingSoon/ComingSoon";

// Catatan: di struktur folder kamu sebelumnya, folder "pengaturan" ada
// bersarang di dalam menu-navbar/laboratorium/. Sebaiknya dipindah ke
// src/pages/pengaturan/ (sejajar dengan halaman lain) supaya rutenya
// jelas dan tidak nyangkut di modul Laboratorium. File ini sudah
// mengasumsikan lokasi barunya.
function Pengaturan() {
  return (
    <ComingSoon
      icon={Settings}
      title="Pengaturan"
      subtitle="Profil akun dan preferensi sistem"
      description="Halaman ini akan menampilkan pengaturan profil petugas, preferensi notifikasi, dan konfigurasi unit begitu endpoint pengaturan tersedia di backend."
      apiHint="GET/PATCH /api/settings"
    />
  );
}

export default Pengaturan;