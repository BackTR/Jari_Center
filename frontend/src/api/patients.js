import api from './axios'

export const createPatient = (payload) => api.post('/patients', payload)

// type: 'jari_id' | 'nik' | 'keyword'
export const identifyPatient = (type, value) =>
  api.get('/patients/identify', { params: { type, value } })
