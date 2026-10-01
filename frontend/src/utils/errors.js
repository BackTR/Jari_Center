// Mengekstrak pesan error yang konsisten dari response axios/Laravel.
export function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.message) return err.message
  return 'Terjadi kesalahan tak terduga. Coba lagi.'
}

// Mengekstrak error per-field dari response validasi 422.
export function extractFieldErrors(err) {
  return err?.response?.data?.errors || {}
}
