// Definisi alur tahap kunjungan sesuai dokumentasi API.
// pending_verification -> verified -> registered -> in_service -> completed
// cancelled bisa dari tahap manapun sebelum completed

export const STAGE_ORDER = [
  'pending_verification',
  'verified',
  'registered',
  'in_service',
  'completed',
]

export const STAGE_LABELS = {
  pending_verification: 'Menunggu Verifikasi',
  verified: 'Terverifikasi',
  registered: 'Terdaftar',
  in_service: 'Sedang Dilayani',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

export const STAGE_TONE = {
  pending_verification: 'warn',
  verified: 'info',
  registered: 'info',
  in_service: 'progress',
  completed: 'success',
  cancelled: 'danger',
}

export function stageLabel(stage) {
  return STAGE_LABELS[stage] || stage
}

// Mengembalikan daftar tahap tujuan yang valid dari tahap saat ini,
// sebagai bantuan tampilan tombol. Server tetap jadi sumber kebenaran validasi.
export function getNextStageOptions(current) {
  const options = []
  const idx = STAGE_ORDER.indexOf(current)

  if (idx !== -1 && idx < STAGE_ORDER.length - 1) {
    options.push(STAGE_ORDER[idx + 1])
  }
  if (current !== 'completed' && current !== 'cancelled') {
    options.push('cancelled')
  }
  return options
}

export const PAYMENT_METHOD_LABELS = {
  mandiri: 'Mandiri',
  bpjs: 'BPJS',
}

export const IDENTIFICATION_METHOD_LABELS = {
  jari_id: 'Jari ID',
  nik: 'NIK',
  fingerprint_simulation: 'Simulasi Sidik Jari',
  qr_code: 'QR Code',
  manual: 'Manual',
}
