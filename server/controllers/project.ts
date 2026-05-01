import type { H3Event } from 'h3'

import { Buffer } from 'node:buffer'
import CategoryModel from '~~/server/models/category'
import ProjectModel from '~~/server/models/project'
import UserModel from '~~/server/models/user'
import { deleteDocumentImages, deleteFromS3 } from '~~/server/utils/s3'
import { generateUniqueSlug } from '~~/server/utils/slug'
import { getRouterParam } from '#imports'

export async function getProjects(event?: H3Event) {
  try {
    const query = event ? getQuery(event) : {}
    const pageSize = Number.parseInt(query.pageSize as string || '0') || 0
    const pageNum = Number.parseInt(query.pageNum as string || '1') || 1
    const skips = pageSize * (pageNum - 1)
    const filters = query.filter || {}

    const searchFilter: any = { status: 'published' }
    if (filters && typeof filters === 'object') {
      Object.assign(searchFilter, filters)
    }

    const projects = await ProjectModel.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip(skips)
      .limit(pageSize)
      .exec()

    const count = await ProjectModel.countDocuments(searchFilter)

    return {
      projects,
      count,
      pageCount: Math.ceil(count / pageSize),
    }
  }
  catch (error) {
    throw createError({ statusCode: 422, message: error instanceof Error ? error.message : 'Failed to fetch projects' })
  }
}

export async function getAdminProjects(event: H3Event) {
  try {
    const session = await requireUserSession(event)
    const sessionUser = session?.user as Record<string, any>

    if (!sessionUser) {
      throw createError({ statusCode: 401, message: 'User not authenticated' })
    }

    const projects = await ProjectModel.find({ author: sessionUser._id })
      .sort({ createdAt: -1 })
      .populate('category', null, CategoryModel)
      .exec()

    return projects
  }
  catch (error) {
    throw createError({
      statusCode: 422,
      message: error instanceof Error ? error.message : 'Failed to fetch admin projects',
    })
  }
}

export async function getProjectById(event: H3Event) {
  try {
    const projectId = getRouterParam(event, 'id')

    const foundProject = await ProjectModel.findById(projectId)
      .populate('category', null, CategoryModel)
      .populate('author', '-_id -password -email -role', UserModel)
      .exec()

    if (!foundProject) {
      throw createError({ statusCode: 404, message: 'Project not found' })
    }

    return foundProject
  }
  catch (error) {
    throw createError({
      statusCode: 422,
      message: error instanceof Error ? error.message : 'Failed to fetch project by ID',
    })
  }
}

export async function getProjectBySlug(event: H3Event) {
  try {
    const slug = getRouterParam(event, 'slug')

    const foundProject = await ProjectModel.findOne({ slug })
      .populate('category', null, CategoryModel)
      .populate('author', '-_id -password -email -role', UserModel)
      .exec()

    if (!foundProject) {
      throw createError({ statusCode: 404, message: 'Project not found' })
    }

    return foundProject
  }
  catch (error) {
    throw createError({
      statusCode: 422,
      message: error instanceof Error ? error.message : 'Failed to fetch project by slug',
    })
  }
}

// Needs recheck
export async function createProject(event: H3Event) {
  const projectData = await readBody(event)
  const { user } = (await requireUserSession(event))
  const project = new ProjectModel(projectData)
  project.author = (user as Record<string, any>)._id

  // Generate storage location with unique slug
  const uniqueSlug = await generateUniqueSlug(projectData.title, ProjectModel)
  project.storageLocation = `projects/${uniqueSlug}`

  return await project.save()
}

export async function updateProject(event: H3Event) {
  const projectId = getRouterParam(event, 'id')

  // Handle both JSON and FormData
  const contentType = getHeader(event, 'content-type') || ''
  let projectData: any

  if (contentType.includes('multipart/form-data')) {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({ statusCode: 400, message: 'Invalid form data' })
    }

    // Extract text fields from FormData first
    const getField = (name: string) => {
      const field = formData.find(f => f.name === name)
      return field?.data.toString() || ''
    }

    // Collect NEW image files for upload (only items with filename are actual files)
    // Important: Must have ALL three conditions to be considered a real file upload
    const newImageFiles = formData.filter(item =>
      item.name === 'images' 
      && item.data 
      && item.data.length > 0
      && item.filename
      && typeof item.filename === 'string'
      && item.filename.length > 0,
    )

    // Get existing images from the request (sent as JSON string in a non-file field)
    // Important: Only parse fields that don't have filename (those are JSON strings, not files)
    const existingImagesField = formData.find(item => 
      item.name === 'images' 
      && (!item.filename || item.filename.length === 0) 
      && item.data
    )
    let existingImages: any[] = []
    if (existingImagesField) {
      try {
        const parsed = JSON.parse(existingImagesField.data.toString())
        existingImages = Array.isArray(parsed) ? parsed : []
      }
      catch (parseError) {
        console.error('Failed to parse existing images JSON:', parseError)
        existingImages = []
      }
    }

    let uploadedImages: any[] = []

    // Scenario determination:
    // 1. No existing images + no new files → skip image operations
    // 2. No existing images + new files → upload new files only
    // 3. Existing images + no new files → keep existing images, skip operations
    // 4. Existing images + new files → delete old from S3, upload new files

    const hasExistingImages = existingImages.length > 0
    const hasNewFiles = newImageFiles.length > 0

    // Fetch the current project to check what's in the database
    const currentProject = await ProjectModel.findById(projectId).exec()
    if (!currentProject) {
      throw createError({ statusCode: 404, message: 'Project not found' })
    }

    const dbHasImages = currentProject.images && Array.isArray(currentProject.images) && currentProject.images.length > 0
    
    // CRITICAL: Only delete old images from S3 if BOTH conditions are true:
    // 1. Database has existing images
    // 2. Request contains NEW file uploads (not just JSON data)
    // Additional safety: Verify that newImageFiles actually contain valid file data
    const hasValidNewFiles = hasNewFiles && newImageFiles.every(file => 
      file.data && file.data.length > 0 && file.filename && file.filename.length > 0
    )
    
    if (dbHasImages && hasValidNewFiles) {
      try {
        await deleteDocumentImages(currentProject, 'images')
      }
      catch (deleteError) {
        console.error('Failed to delete old images from S3:', deleteError)
        // Continue with upload even if delete fails, but log the error
      }
    }

    // Upload new images if there are any (scenarios 2 and 4)
    if (hasNewFiles) {
      try {
        // Create a new FormData to send to the upload endpoint
        const uploadFormData = new FormData()
        newImageFiles.forEach((file) => {
          // Convert Buffer to File/Blob for the upload endpoint
          const fileData = Buffer.from(file.data)
          const blob = new Blob([fileData], { type: file.type || 'application/octet-stream' })
          uploadFormData.append('files', blob, file.filename!)
        })

        uploadFormData.append('storageLocation', getField('storageLocation'))

        // Get the base URL for internal API calls
        const baseUrl = process.env.NUXT_PUBLIC_SITE_URL
          || process.env.BASE_URL
          || 'http://localhost:3400'

        // Call the upload API endpoint using native fetch
        const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
          method: 'POST',
          body: uploadFormData,
          // Don't set Content-Type - let the browser/node set it with boundary
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}))
          throw new Error(errorData.statusMessage || 'Upload failed')
        }

        const result = await uploadResponse.json()

        // Extract the uploaded file information
        if (result.success && result.files) {
          uploadedImages = result.files.map((file: any) => ({
            location: file.fileUrl,
            key: file.fileName,
            size: file.fileSize,
            mimeType: file.mimeType,
          }))
        }
      }
      catch (uploadError) {
        console.error('Failed to upload images:', uploadError)
        throw createError({
          statusCode: 500,
          message: uploadError instanceof Error ? uploadError.message : 'Failed to upload images to S3',
        })
      }
    }
    else if (hasExistingImages) {
      // Scenario 3: Use existing images from the request
      uploadedImages = existingImages
    }
    // Scenario 1: No images at all, leave uploadedImages as empty array

    projectData = {
      authorID: getField('authorID'),
      categoryID: getField('categoryID'),
      createdAt: getField('createdAt'),
      description: getField('description'),
      promoVideoLink: getField('promoVideoLink'),
      productLink: getField('productLink'),
      requirements: getField('requirements'),
      status: getField('status'),
      subtitle: getField('subtitle'),
      title: getField('title'),
      storageLocation: getField('storageLocation'),
      storageLocationNew: getField('storageLocationNew'),
      updatedAt: getField('updatedAt'),
      wsl: getField('wsl'),
    }

    // Set images based on the scenario
    // Only update images field if we have new uploads or explicit existing images
    if (hasNewFiles || hasExistingImages) {
      projectData.images = uploadedImages
      // Mark the images field as modified to ensure Mongoose saves the change
      currentProject.markModified('images')
    }
  }
  else {
    projectData = await readBody(event)
  }

  // Parse JSON strings safely
  try {
    projectData.requirements = typeof projectData.requirements === 'string'
      ? JSON.parse(projectData.requirements)
      : projectData.requirements
  }
  catch {
    projectData.requirements = []
  }

  try {
    projectData.wsl = typeof projectData.wsl === 'string'
      ? JSON.parse(projectData.wsl)
      : projectData.wsl
  }
  catch {
    projectData.wsl = []
  }

  projectData.updatedAt = Date.now()

  const project = await ProjectModel.findById(projectId)
    .populate('category', null, CategoryModel)
    .exec()

  if (!project)
    throw createError({ statusCode: 404, message: 'Project not found' })

  if (projectData.status && projectData.status === 'published') {
    project.slug = await generateUniqueSlug(project.title, ProjectModel, projectId)
  }

  project.set(projectData)
  return await project.save()
}

export async function deleteProject(event: H3Event) {
  try {
    const projectId = getRouterParam(event, 'id')

    await ProjectModel.deleteOne({ _id: projectId })
    return { status: true, message: 'The Project has been deleted Successfully...' }
  }
  catch (error) {
    throw createError({ statusCode: 500, message: error instanceof Error ? error.message : 'Failed to delete project' })
  }
}

export async function deleteProjectImage(event: H3Event) {
  try {
    const imageId = getRouterParam(event, 'imageId')
    const projectId = getRouterParam(event, 'id')
    const { field, index, s3Key } = await readBody(event)

    const project = await ProjectModel.findById(projectId)
    if (!project) {
      throw createError({ statusCode: 404, message: 'Project not found' })
    }

    // Delete from S3 if s3Key is provided (for existing uploaded images)
    if (s3Key) {
      try {
        await deleteFromS3(s3Key)
      }
      catch (s3Error) {
        console.error(`Failed to delete from S3: ${s3Key}`, s3Error)
        // Continue with database update even if S3 deletion fails
      }
    }

    // Remove from database
    if (field === 'images' && Array.isArray(project.images)) {
      project.images.splice(index, 1)
      // Mark the array as modified to ensure Mongoose saves the change
      project.markModified('images')
    }
    else if (field === 'image') {
      project.image = ''
    }

    await project.save()
    
    return { 
      success: true, 
      message: 'Image deleted successfully',
      remainingImages: project.images?.length || 0,
    }
  }
  catch (error) {
    console.error('Error deleting project image:', error)
    throw createError({ 
      statusCode: 500, 
      message: error instanceof Error ? error.message : 'Failed to delete project image' 
    })
  }
}