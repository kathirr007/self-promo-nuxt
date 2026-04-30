import type { H3Event } from 'h3'
import type { ProjectHero } from '~~/server/models/types/project-hero'
import ProjectModel from '~~/server/models/project'
// import { HTTPError } from 'h3'
import ProjectHeroModel from '~~/server/models/project-hero'

export async function createHero(event: H3Event) {
  try {
    const projectData = await readBody<ProjectHero>(event)

    const projectHero = new ProjectHeroModel(projectData)

    const createdHero = await projectHero.save()
    return createdHero
  }
  catch (errors) {
    throw createError({ statusCode: 422, message: errors instanceof Error ? errors.message : 'An error occurred while creating the hero' })
  }
}

export async function getProjectHeroes(event: H3Event) {
  try {
    const heroes = await ProjectHeroModel.find({})
      .populate('project', null, ProjectModel)
      .sort({ createdAt: -1 })
      .exec()

    return heroes
  }
  catch (errors) {
    throw createError({ statusCode: 422, message: errors instanceof Error ? errors.message : 'An error occurred while getting project heroes' })
  }
}

export async function updateProjectHero(event: H3Event) {
  try {
    const id = getRouterParam(event, 'id')

    const hero = await ProjectHeroModel.findById(id)
      .populate('project', ProjectModel)
      .exec()

    if (!hero) {
      throw createError({ statusCode: 404, message: 'Hero not found' })
    }

    hero.set({ createdAt: new Date() })
    const updatedHero = await hero.save()

    return updatedHero
  }
  catch (errors) {
    throw createError({ statusCode: 422, message: errors instanceof Error ? errors.message : 'An error occurred while updating the hero' })
  }
}

export async function deleteProjectHero(event: H3Event) {
  try {
    const heroId = getRouterParam(event, 'id')

    const deletedHero = await ProjectHeroModel.deleteOne({
      _id: heroId,
    })

    if (deletedHero.deletedCount === 0) {
      throw createError({ statusCode: 404, message: 'Hero not found' })
    }

    return {
      status: true,
      message: 'The Hero has been deleted Successfully...',
    }
  }
  catch (err: any) {
    throw createError({ statusCode: 500, message: err.message })
  }
}
