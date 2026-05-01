import { acceptHMRUpdate, defineStore } from 'pinia'

function separateExperiences(experiences: any[]) {
  const published: any[] = []
  const drafts: any[] = []
  experiences.forEach((experience) => {
    experience.status === 'active' ? drafts.push(experience) : published.push(experience)
  })
  return { published, drafts }
}

export const useAdminExperienceStore = defineStore('adminExperience', () => {
  const items = ref({ drafts: [] as any[], published: [] as any[] })
  const item = ref<Record<string, any>>({})
  const isSaving = ref(false)

  async function createExperience(experienceData: Record<string, any>) {
    try {
      const experience = await $fetch('/api/experiences', { method: 'POST', body: experienceData })
      push.success({
        title: 'Experience Created',
        message: `Experience "${experienceData.title || experienceData.position}" has been created successfully.`,
        duration: 4000,
      })
      return experience
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to create experience. Please try again.'
      push.error({
        title: 'Create Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function fetchExperienceById(experienceId: string) {
    try {
      const experience = await $fetch<any>(`/api/experiences/${experienceId}`)
      item.value = experience
      return experience
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: 'Failed to load experience details.',
        duration: 5000,
      })
      throw error
    }
  }

  async function fetchUserExperiences() {
    try {
      const experiences = await $fetch<any[]>('/api/experiences/me')
      const { published, drafts } = separateExperiences(experiences)
      items.value.drafts = drafts
      items.value.published = published
      return { published, drafts }
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: 'Failed to load your experiences. Please try again.',
        duration: 5000,
      })
      throw error
    }
  }

  async function updateExperience(id: string, data: Record<string, any>) {
    isSaving.value = true
    try {
      const experience = await $fetch<any>(`/api/experiences/${id}`, { method: 'PUT', body: data })
      item.value = experience
      push.success({
        title: 'Experience Update',
        message: `Experience "${data.title || data.position}" has been updated successfully.`,
        duration: 4000,
      })
      return experience
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to update experience. Please try again.'
      push.error({
        title: 'Update Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
    finally {
      isSaving.value = false
    }
  }

  async function updatePublishedExperience(id: string, data: Record<string, any>) {
    try {
      const experience = await $fetch<any>(`/api/experiences/${id}`, { method: 'PUT', body: data })
      const index = items.value.published.findIndex(b => b._id === id)
      if (index !== -1)
        items.value.published[index] = experience

      push.success({
        title: 'Experience Published',
        message: `Experience "${data.title || data.position}" has been updated and published successfully.`,
        duration: 4000,
      })
      return experience
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to publish experience. Please try again.'
      push.error({
        title: 'Publish Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function deleteExperience(experience: Record<string, any>) {
    try {
      const resource = experience.status === 'active' ? 'drafts' : 'published'
      await $fetch(`/api/experiences/${experience._id}`, { method: 'DELETE' })
      const experienceIndex = items.value[resource].findIndex(b => b._id === experience._id)
      if (experienceIndex !== -1)
        items.value[resource].splice(experienceIndex, 1)

      push.success({
        title: 'Experience Deleted',
        message: `Experience "${experience.title || experience.position}" has been deleted successfully.`,
        duration: 4000,
      })
      return true
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to delete experience. Please try again.'
      push.error({
        title: 'Delete Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  return { items, item, isSaving, createExperience, fetchExperienceById, fetchUserExperiences, updateExperience, updatePublishedExperience, deleteExperience }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAdminExperienceStore, import.meta.hot))
