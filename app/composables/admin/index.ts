import { acceptHMRUpdate, defineStore } from 'pinia'
import { useHeroesStore } from '../heroes'

export const useAdminStore = defineStore('admin', () => {
  const heroes = ref<any[]>([])

  async function fetchHeroes() {
    const result = await $fetch<any[]>('/api/project-heroes')
    heroes.value = result
    return heroes.value
  }

  async function activateHero(heroId: string) {
    const activeHero = await $fetch<any>(`/api/project-heroes/${heroId}`, { method: 'PATCH' })
    const heroesStore = useHeroesStore()
    heroesStore.projectHero = activeHero
    return activeHero
  }

  async function deleteHero(heroId: string) {
    await $fetch(`/api/project-heroes/${heroId}`, { method: 'DELETE' })
    const heroIndex = heroes.value.findIndex(b => b._id === heroId)
    if (heroIndex !== -1)
      heroes.value.splice(heroIndex, 1)
  }

  return { heroes, fetchHeroes, activateHero, deleteHero }
}, {
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAdminStore, import.meta.hot))
