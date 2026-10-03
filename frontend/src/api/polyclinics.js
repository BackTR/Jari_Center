import api from './axios.js'

export function getPolyclinics(facilityId) {
  return api.get('/polyclinics', {
    params: { facility_id: facilityId },
  })
}