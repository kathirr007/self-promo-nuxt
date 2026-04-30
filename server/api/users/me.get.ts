// import type { H3Event } from 'h3'
import { getCurrentUser } from '~~/server/controllers/user'

export default defineEventHandler(async (event: H3Event) => {
  return await getCurrentUser(event)
})
