import { acceptHMRUpdate, defineStore } from 'pinia'
import slugify from 'slugify'

export const useAdminProjectStore = defineStore('adminProject', () => {
  const items = ref<any[]>([])
  const item = ref<Record<string, any>>({ storageLocation: null })
  const canUpdateProject = ref(false)

  async function fetchAdminProjects() {
    const projects = await $fetch<any[]>('/api/projects/user-projects')
    items.value = projects
    return items.value
  }

  async function fetchProjectById(projectId: string) {
    const project = await $fetch<any>(`/api/projects/${projectId}`)
    item.value = project
    return item.value
  }

  async function createProject(projectData: Record<string, any>) {
    try {
      setProjectValue('title', projectData.title)
      await $fetch('/api/projects/', { method: 'POST', body: projectData })
      push.success({
        title: 'Project Created',
        message: `Project "${projectData.title}" has been created successfully.`,
        duration: 4000,
      })
      await navigateTo('/admin/projects')
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to create project. Please try again.'
      push.error({
        title: 'Create Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function updateProject() {
    try {
      const project = item.value
      const data = new FormData()
      let uploadedFiles: string | null = null
      let deleteFiles = false

      // Check if images array exists and has items
      if (project.images && Array.isArray(project.images) && project.images.length > 0) {
        if (typeof project.images[0].location === 'undefined') {
          // New files to upload
          for (let i = 0; i < project.images.length; i++) {
            data.append('images', project.images[i])
          }
          uploadedFiles = JSON.stringify(project.uploadedFiles)
          deleteFiles = true
        }
        else {
          // Existing images (already have location)
          uploadedFiles = JSON.stringify(project.images)
          data.append('images', uploadedFiles)
        }
      }
      else {
        // No images
        uploadedFiles = '[]'
        data.append('images', uploadedFiles)
      }

      data.append('authorID', project.author)
      data.append('categoryID', project.category)
      data.append('createdAt', project.createdAt)
      data.append('description', project.description)
      data.append('promoVideoLink', project.promoVideoLink || '')
      data.append('productLink', project.productLink || '')
      data.append('requirements', JSON.stringify(project.requirements || []))
      data.append('status', project.status)
      data.append('subtitle', project.subtitle || '')
      data.append('title', project.title)
      data.append('storageLocation', project.storageLocation || '')
      data.append('storageLocationNew', project.storageLocationNew || '')
      data.append('updatedAt', project.updatedAt)
      data.append('wsl', JSON.stringify(project.wsl || []))

      const headers = {
        storagelocation: project.storageLocation,
        storagelocationnew: project.storageLocationNew,
        uploadedfiles: uploadedFiles,
        deletefiles: String(deleteFiles),
      }

      // Use native fetch instead of $fetch to better handle FormData
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PATCH',
        body: data,
        // Don't set Content-Type header - browser will set it with boundary
        headers,
      })

      if (!response.ok) {
        // Try to get error details from response
        let errorDetails = ''
        try {
          const errorData = await response.json()
          errorDetails = errorData.message || errorData.statusMessage || 'Unknown server error'
        }
        catch {
          errorDetails = `Server responded with ${response.status} ${response.statusText}`
        }
        console.error('Server error:', errorDetails)
        throw new Error(errorDetails)
      }

      const updated = await response.json()
      item.value = updated

      push.success({
        title: 'Project Updated',
        message: `Project "${project.title}" has been updated successfully.`,
        duration: 4000,
      })
      return updated
    }
    catch (error: any) {
      // Log the actual error for debugging
      console.error('Update project error:', error)

      // Try to get the actual error message from different sources
      const message = error?.message
        || error?.data?.message
        || error?.response?.data?.message
        || 'Failed to update project. Please try again.'

      push.error({
        title: 'Update Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function deleteProjectImage(params: { field: string, index: number, s3Key: string, projectId: string, key: string }) {
    try {
      await $fetch(`/api/projects/${params.projectId}/prod-image/${params.key}`, {
        method: 'DELETE',
        body: {
          field: params.field,
          index: params.index,
          s3Key: params.s3Key,
        },
      })
      canUpdateProject.value = true
      push.success({
        title: 'Image Deleted',
        message: 'Project image has been deleted successfully.',
        duration: 3000,
      })
      return true
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to delete project image. Please try again.'
      push.error({
        title: 'Delete Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function deleteProject(project: Record<string, any>) {
    try {
      const uploadedFiles = JSON.stringify(project.images)
      const headers = {
        storagelocation: project.storageLocation,
        storagelocationnew: project.storageLocationNew,
        uploadedfiles: uploadedFiles,
        deletefiles: 'true',
      }
      await $fetch(`/api/projects/${project._id}`, { method: 'DELETE', headers })
      const projectIndex = items.value.findIndex(b => b._id === project._id)
      if (projectIndex !== -1)
        items.value.splice(projectIndex, 1)

      push.success({
        title: 'Project Deleted',
        message: `Project "${project.title}" has been deleted successfully.`,
        duration: 4000,
      })
      return true
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to delete project. Please try again.'
      push.error({
        title: 'Delete Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  function addLine(field: string) {
    item.value[field].push({ value: '' })
  }

  function removeLine(field: string, index: number) {
    item.value[field].splice(index, 1)
  }

  function removeProjectImage(field: string, index: number) {
    item.value[field].splice(index, 1)
  }

  function setLineValue(field: string, index: number, value: any) {
    item.value[field][index].value = value
    canUpdateProject.value = true
  }

  function setProjectValue(field: string, value: any) {
    if (field === 'title') {
      const storageLocationNew = `projects/${slugify(value, { replacement: '-', remove: undefined, lower: true })}`
      if (storageLocationNew !== item.value.storageLocation) {
        item.value.storageLocation = storageLocationNew
        item.value.storageLocationNew = storageLocationNew
      }
      canUpdateProject.value = !!(value && value.length >= 10)
    }
    else {
      canUpdateProject.value = true
    }
    item.value[field] = value
  }

  function updateUploadedFiles(value: any) {
    item.value.uploadedFiles = value
  }

  return {
    items,
    item,
    canUpdateProject,
    fetchAdminProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProjectImage,
    deleteProject,
    addLine,
    removeLine,
    removeProjectImage,
    setLineValue,
    setProjectValue,
    updateUploadedFiles,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAdminProjectStore, import.meta.hot))
