import { createExperience, deleteExperience, getExperiences, updateExperience } from '~~/server/controllers/experience'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    return await getExperiences(event)
  }
  else if (method === 'POST') {
    return await createExperience(event)
  }
  else if (method === 'PUT') {
    return await updateExperience(event)
  }
  else if (method === 'DELETE') {
    return await deleteExperience(event)
  }
})