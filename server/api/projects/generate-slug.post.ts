import ProjectModel from '~~/server/models/project'
import { generateUniqueSlug } from '~~/server/utils/slug'

// POST /api/projects/generate-slug
export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, message: 'Method not allowed' })
  }

  const { title, currentId } = await readBody(event)

  if (!title) {
    throw createError({ statusCode: 400, message: 'Title is required' })
  }

  return await generateUniqueSlug(title, ProjectModel, currentId)
})
