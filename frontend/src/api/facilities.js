import api from './axios'

export const getFacilityDashboard = (facilityId) => {
  return api.get(`/facilities/${facilityId}/dashboard`)
}