import type { Experience as ExperienceType } from '~~/server/models/types/experience'
import type { H3Event } from '#imports'
import AsyncLock from 'async-lock'
import Experience from '~~/server/models/experience'
import UserModel from '~~/server/models/user'
import { generateUniqueSlug } from '~~/server/utils/slug'

const lock = new AsyncLock()

interface ExperienceFilters {
  status?: string
  [key: string]: any
}

interface PaginationQuery {
  pageSize?: string
  pageNum?: string
  filter?: ExperienceFilters
}

function parseFilters(queries: any) {
  const parsedQueries: any = {}
  if (queries.filter) {
    Object.keys(queries).forEach((qKey) => {
      if (qKey.includes('filter')) {
        const pKey = qKey.match(/\[([^)]+)\]/)?.[1]
        if (pKey) {
          parsedQueries[pKey] = queries[qKey]
        }
      }
    })
  }
  return parsedQueries
}

export async function getExperiences(event: H3Event) {
  // return 'This endpoint is currently disabled for development purposes. Please check back later.'

  try {
    const query = getQuery(event) as PaginationQuery

    // const url = getRequestURL(event)
    // const query = Object.fromEntries(url?.searchParams ?? [])
    const pageSize = Number.parseInt(query.pageSize || '0') || 0
    const pageNum = Number.parseInt(query.pageNum || '1') || 1
    const skips = pageSize * (pageNum - 1)
    const filters = query.filter || {}

    const publishedExperiences = await Experience.find({ status: 'published', ...filters })
      .sort({ updatedAt: -1 })
      // .populate('author', '-_id -password -products -email -role')
      .skip(skips)
      .limit(pageSize)
      .exec()

    const count = await Experience.countDocuments({ status: 'published' })

    return {
      experiences: publishedExperiences,
      count,
      pageCount: Math.ceil(count / pageSize),
    }
  }
  catch (error) {
    throw createError({ statusCode: 422, message: error instanceof Error ? error.message : 'Failed to fetch experiences' })
  }
}

export async function getExperienceBySlug(event: any) {
  try {
    const slug = getRouterParam(event, 'slug')

    const foundExperience = await Experience.findOne({ slug })
      .populate('author', '-_id -password -products -email -role', UserModel)
      .exec()

    return foundExperience
  }
  catch (error) {
    throw createError({
      statusCode: 422,
      message: error instanceof Error ? error.message : 'Failed to fetch experience by slug',
    })
  }
}

export async function getExperienceById(event: any) {
  try {
    const experienceId = getRouterParam(event, 'id')

    const foundExperience = await Experience.findOne({ _id: experienceId })
      .populate('author', '-_id -password -products -email -role', UserModel)
      .exec()

    return foundExperience
  }
  catch (error) {
    throw createError({ statusCode: 422, message: 'Failed to fetch experience by ID' })
  }
}

export async function getUserExperiences(event: any) {
  try {
    const session = await requireUserSession(event)

    // Ensure the ID exists and is a valid format before querying
    const sessionUser = session?.user as Record<string, any>
    if (!sessionUser) {
      throw new Error('User not authenticated')
    }

    const userExperiences = await Experience.find({ author: sessionUser._id })
      .sort({ createdAt: -1 })
      .exec()

    return userExperiences
  }
  catch (error) {
    throw createError({ statusCode: 422, message: error instanceof Error ? error.message : 'Failed to fetch user experiences' })
  }
}

export async function createExperience(event: any) {
  try {
    const query = getQuery(event)
    const lockId = query.lockId as string

    // return 'This endpoint is currently disabled for development purposes. Please check back later.'

    if (!lock.isBusy(lockId)) {
      return new Promise((resolve, reject) => {
        lock.acquire(
          lockId,
          async (done) => {
            try {
              const session = await requireUserSession(event)

              // Ensure the ID exists and is a valid format before querying
              const sessionUser = session?.user as Record<string, any>
              if (!sessionUser) {
                throw new Error('User not authenticated')
              }

              const experienceData = await readBody<ExperienceType>(event)
              const experience = new Experience(experienceData)
              experience.author = sessionUser._id

              // Generate unique slug if experience is being published
              if (experienceData.status === 'published' && experienceData.title) {
                experience.slug = await generateUniqueSlug(experienceData.title, Experience)
              }

              const createdExperience = await experience.save()
              setTimeout(done, 5000)
              resolve(createdExperience)
            }
            catch (error) {
              done()
              reject(createError({ statusCode: 422, message: 'Failed to create experience' }))
            }
          },
          (errors) => {
            if (errors) {
              console.error(errors)
              reject(createError({ statusCode: 422, message: 'Lock acquisition failed' }))
            }
          },
        )
      })
    }
    else {
      throw createError({ statusCode: 422, message: 'Experience is getting saved!' })
    }
  }
  catch (error) {
    throw createError({ statusCode: 422, message: 'Failed to create experience' })
  }
}

export async function updateExperience(event: any) {
  try {
    const experienceId = getRouterParam(event, 'id')
    const experienceData = await readBody<ExperienceType>(event)

    const foundExperience = await Experience.findById(experienceId)

    if (!foundExperience || !experienceData) {
      throw createError({ statusCode: 404, message: 'Experience not found' })
    }

    const session = await requireUserSession(event)
    const sessionUser = session?.user as Record<string, any>
    if (!sessionUser) {
      throw new Error('User not authenticated')
    }

    if (experienceData?.status && experienceData.status === 'published') {
      foundExperience.slug = await generateUniqueSlug(foundExperience.title, Experience, experienceId)
    }

    foundExperience.set(experienceData)
    foundExperience.updatedAt = new Date()

    const savedExperience = await foundExperience.save()
    return savedExperience
  }
  catch (error) {
    throw createError({ statusCode: 422, message: 'Failed to update experience' })
  }
}

export async function deleteExperience(event: any) {
  try {
    const experienceId = getRouterParam(event, 'id')

    await Experience.deleteOne({ _id: experienceId })
    return { status: 'deleted' }
  }
  catch (error) {
    throw createError({ statusCode: 422, message: 'Failed to delete experience' })
  }
}
