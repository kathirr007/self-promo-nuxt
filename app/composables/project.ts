import { acceptHMRUpdate, defineStore } from 'pinia'

export const useProjectStore = defineStore('project', () => {
  const items = ref<any[]>([])
  const item = ref<Record<string, any>>({})

  async function fetchProjects() {
    try {
      const { projects } = await $fetch<Record<string, any>>('/api/projects')
      items.value = projects
      return projects
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: 'Failed to load projects. Please try again.',
        duration: 5000,
      })
      throw error
    }
  }

  async function fetchProjectBySlug(projectSlug: string) {
    try {
      const project = await $fetch<any>(`/api/projects/slug/${projectSlug}`)
      item.value = project
      return project
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: `Failed to load project "${projectSlug}".`,
        duration: 5000,
      })
      throw error
    }
  }

  return { items, item, fetchProjects, fetchProjectBySlug }
}, {
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
