import type { H3Event } from 'h3'
import { getUserExperiences } from '~~/server/controllers/experience'

export default defineEventHandler(async (event: H3Event) => {
  return await getUserExperiences(event)
})
