import { deleteProjectHero, updateProjectHero } from '~~/server/controllers/project-hero'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'PUT') {
    return await updateProjectHero(event)
  }
  else if (method === 'DELETE') {
    return await deleteProjectHero(event)
  }

  throw createError({ statusCode: 404, message: 'Not Found api router' })
})
