import api from './axios'

export const getQueues = (facilityId, params = {}) => {
  return api.get(`/facilities/${facilityId}/queues`, {
    params,
  })
}