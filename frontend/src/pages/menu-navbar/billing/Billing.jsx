import { Receipt } from "lucide-react";
import ComingSoon from "../../../components/ComingSoon/ComingSoon";

function Billing() {
  return (
    <ComingSoon
      icon={Receipt}
      title="Billing"
      subtitle="Tagihan dan pembayaran pasien"
      description="Halaman ini akan menampilkan rincian tagihan, status pembayaran, dan riwayat transaksi pasien begitu endpoint billing tersedia di backend."
      apiHint="GET /api/billing"
    />
  );
}

export default Billing;