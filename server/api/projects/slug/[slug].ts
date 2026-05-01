import { getProjectBySlug } from '~~/server/controllers/project'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      // GET /api/products/slug/[slug]
      return await getProjectBySlug(event)

    default:
      throw createError({ statusCode: 404, message: 'Not Found api router' })
  }
})
