import { generateUniqueSlug } from '~~/server/utils/slug'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, message: 'Method not allowed' })
  }

  const { title, currentId } = await readBody(event)

  if (!title) {
    throw createError({ statusCode: 400, message: 'Title is required' })
  }

  return await generateUniqueSlug(title, currentId)
})
