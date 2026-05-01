import { acceptHMRUpdate, defineStore } from 'pinia'

export const useHeroesStore = defineStore('heroes', () => {
  const push = usePush()
  const projectHero = ref<Record<string, any>>({})

  async function createHero(projectHeroData: Record<string, any>) {
    try {
      const hero = await $fetch<any>('/api/project-heroes', { method: 'POST', body: projectHeroData })
      projectHero.value = hero
      push.success({
        title: 'Hero Created',
        message: 'Project hero section has been created successfully.',
        duration: 4000,
      })
      return hero
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Failed to create hero section. Please try again.'
      push.error({
        title: 'Create Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function fetchHero() {
    try {
      const heroes = await $fetch<any>('/api/project-heroes')
      projectHero.value = heroes
      return heroes
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: 'Failed to load hero section data.',
        duration: 5000,
      })
      throw error
    }
  }

  return { projectHero, createHero, fetchHero }
}, {
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useHeroesStore, import.meta.hot))
