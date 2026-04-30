import type { H3Event } from '#imports'
import { createCategory, deleteCategory, getCategories, updateCategory } from '~~/server/controllers/category'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.node.req.method

  switch (method) {
    case 'POST':
      return await createCategory(event)
    case 'GET': {
      return await getCategories(event)
    }
    case 'PUT':
      return await updateCategory(event)
    // case 'DELETE':
    //   return await deleteCategory(event)
    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
  }
})
