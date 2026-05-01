import { createHero, deleteProjectHero, getProjectHeroes, updateProjectHero } from '~~/server/controllers/project-hero'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    return await getProjectHeroes(event)
  }
  else if (method === 'POST') {
    return await createHero(event)
  }
  else if (method === 'PUT') {
    return await updateProjectHero(event)
  }
  else if (method === 'DELETE') {
    return await deleteProjectHero(event)
  }
})
