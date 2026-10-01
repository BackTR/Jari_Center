import axios from 'axios'

// VITE_API_BASE_URL diverifikasi di vite.config.js saat start/build, bukan di sini.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

// Sisipkan token Bearer ke setiap request kalau ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jari_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Kalau server balas 401 di luar /login, anggap token expired/invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('jari_token')
      localStorage.removeItem('jari_user')
      window.dispatchEvent(new Event('jari:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default api
