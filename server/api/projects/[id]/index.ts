import { onlyAdmin } from '~~/server/controllers/auth'
import { deleteProject, getProjectById, updateProject } from '~~/server/controllers/project'
import ProjectModel from '~~/server/models/project'
import { deleteDocumentImages } from '~~/server/utils/s3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET': {
      return await getProjectById(event)
    }
    case 'PATCH': {
      // PATCH /api/projects/[id]
      await onlyAdmin(event)
      return await updateProject(event)
    }

    case 'DELETE': {
      // DELETE /api/projects/[id]
      await onlyAdmin(event)
      const projectId = getRouterParam(event, 'id')
      const project = await ProjectModel.findById(projectId)
      if (project) {
        await deleteDocumentImages(project)
      }
      return await deleteProject(event)
    }

    default: {
      throw createError({ statusCode: 404, message: 'Not Found api router' })
    }
  }
})