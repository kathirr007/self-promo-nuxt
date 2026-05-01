import type { H3Event } from 'h3'
import { deleteCategory, getCategoryById } from '~~/server/controllers/category'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET': {
      return await getCategoryById(event)
    }
    case 'DELETE':
      return await deleteCategory(event)
    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
  }
})
