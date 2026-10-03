import api from './axios'

export const createPatient = (payload) => api.post('/patients', payload)

// type: 'jari_id' | 'nik' | 'keyword'
export const identifyPatient = (type, value) =>
  api.get('/patients/identify', { params: { type, value } })

export const enrollFingerprint = (patientId, template) =>
  api.post(`/patients/${patientId}/fingerprint/enroll`, { template })

export const matchFingerprint = (template) =>
  api.post('/fingerprint/match', { template })
