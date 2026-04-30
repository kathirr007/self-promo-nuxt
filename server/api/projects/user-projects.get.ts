import { getAdminProjects } from '~~/server/controllers/project'

export default defineEventHandler(async (event) => {
  // GET /api/projects/user-projects

  return await getAdminProjects(event)
})
