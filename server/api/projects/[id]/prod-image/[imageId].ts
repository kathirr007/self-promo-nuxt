import type { H3Event } from 'h3'
import { onlyAdmin } from '~~/server/controllers/auth'
import { deleteProjectImage } from '~~/server/controllers/project'

export default defineEventHandler(async (event: H3Event) => {
  // DELETE /api/projects/ProdImage/[id]

  const method = event.node.req.method

  switch (method) {
    case 'DELETE':
      await onlyAdmin(event)
      return await deleteProjectImage(event)

    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
  }
})
