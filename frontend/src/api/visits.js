import api from './axios'

export const createVisit = (payload) =>
  api.post('/visits', payload)

export const getVisits = (facilityId, date = null) => {
  const params = { facility_id: facilityId }
  if (date) params.date = date
  return api.get('/visits', { params })
}

export const getVisit = (id) =>
  api.get(`/visits/${id}`)

export const updateVisitStage = (
  id,
  stage,
  notes
) =>
  api.patch(
    `/visits/${id}/stage`,
    {
      stage,
      notes,
    }
  )