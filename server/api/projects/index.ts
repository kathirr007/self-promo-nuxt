// Nuxt 4 API routes use file-based routing with HTTP method handlers
// This replaces the Express router pattern

import { onlyAdmin } from '~~/server/controllers/auth'
import { createProject, getProjects } from '~~/server/controllers/project'

// GET /api/projects
export default defineEventHandler(async (event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      // GET /api/projects
      return await getProjects()

    case 'POST':
      // POST /api/projects
      await onlyAdmin(event)
      return await createProject(event)

    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
  }
})
