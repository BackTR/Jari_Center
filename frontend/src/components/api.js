// api.js
// Wrapper terpusat untuk semua request ke backend Jari Center.
// Semua pemanggilan API di project sebaiknya lewat file ini, bukan fetch() langsung,
// supaya header, token, dan penanganan error konsisten di satu tempat.

// Untuk production, pindahkan ke .env (import.meta.env.VITE_API_BASE_URL)
export const API_BASE_URL = "http://127.0.0.1:8000/api";

const TOKEN_KEY = "jari_token";
const USER_KEY = "jari_user";

// ===================== Auth storage helpers =====================

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

// ===================== Custom error class =====================

// Dipakai supaya komponen bisa baca .status & .errors dari response backend
// (bukan cuma pesan generik dari fetch/JSON.parse).
export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors; // object { field: [pesan] } dari response 422 Laravel
  }
}

// ===================== Core request wrapper =====================

/**
 * Request generik ke backend Jari Center.
 * @param {string} path - contoh: "/patients" atau "/visits/1/stage"
 * @param {object} options - { method, body, headers, auth }
 *   - auth: true (default) untuk sisipkan Bearer token, false untuk endpoint publik (mis. /login)
 */
async function apiFetch(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const finalHeaders = {
    "Content-Type": "application/json",
    // Wajib dikirim di setiap request menurut dokumentasi API
    Accept: "application/json",
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Gagal konek sama sekali (server mati, CORS, dll)
    throw new ApiError("Tidak bisa terhubung ke server.", 0);
  }

  // Response tanpa body (mis. 204) — jangan dipaksa parse JSON
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (res.status === 401) {
    // Token expired/invalid — sesuai catatan di dokumentasi, redirect ke login
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Sesi berakhir, silakan login kembali.", 401);
  }

  if (!res.ok) {
    const message = data?.message || "Terjadi kesalahan pada server.";
    throw new ApiError(message, res.status, data?.errors || null);
  }

  return data;
}

// ===================== 1. Auth =====================

export async function login(email, password) {
  const data = await apiFetch("/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  setAuth(data.token, data.user);
  return data;
}

export async function logout() {
  try {
    await apiFetch("/logout", { method: "POST" });
  } finally {
    // Tetap bersihkan auth lokal walau request logout gagal
    clearAuth();
  }
}

// ===================== 2. Patient =====================

export async function createPatient(payload) {
  // payload: { nik?, name, date_of_birth, gender, address?, phone?,
  //            insurance_provider?, insurance_number? }
  const data = await apiFetch("/patients", {
    method: "POST",
    body: payload,
  });
  return data.data;
}

/**
 * @param {"jari_id"|"nik"|"keyword"} type
 * @param {string} value
 */
export async function identifyPatient(type, value) {
  const params = new URLSearchParams({ type, value });
  const data = await apiFetch(`/patients/identify?${params.toString()}`);
  return data.data; // array (bisa kosong kalau tidak ketemu — bukan error)
}

// ===================== 3. Visit =====================

export async function createVisit(payload) {
  // payload: { patient_id, facility_id, polyclinic_id?, identification_method,
  //            payment_method, bpjs_number?, referral_letter_number?, notes? }
  const data = await apiFetch("/visits", {
    method: "POST",
    body: payload,
  });
  return data.data;
}

export async function getVisit(id) {
  const data = await apiFetch(`/visits/${id}`);
  return data.data;
}

/**
 * @param {number} id
 * @param {"verified"|"registered"|"in_service"|"completed"|"cancelled"} stage
 * @param {string} [notes]
 */
export async function updateVisitStage(id, stage, notes) {
  const data = await apiFetch(`/visits/${id}/stage`, {
    method: "PATCH",
    body: { stage, notes },
  });
  return data.data;
}