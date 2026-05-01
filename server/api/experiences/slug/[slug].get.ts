import { getExperienceBySlug } from '~~/server/controllers/experience'

export default defineEventHandler(async (event) => {
  return await getExperienceBySlug(event)
})
