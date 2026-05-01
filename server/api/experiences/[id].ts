import { deleteExperience, getExperienceById, updateExperience } from '~~/server/controllers/experience'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    return await getExperienceById(event)
  }
  if (method === 'PUT') {
    return await updateExperience(event)
  }
  else if (method === 'DELETE') {
    return await deleteExperience(event)
  }

  throw createError({ statusCode: 404, message: 'Not Found api router' })
})
