import { acceptHMRUpdate, defineStore } from 'pinia'

export const useExperiencesStore = defineStore('experiences', () => {
  const items = ref({ all: [] as any[], featured: [] as any[], drafts: [] as any[], published: [] as any[] })
  const item = ref<Record<string, any>>({})
  const pagination = ref({ count: 0, pageCount: 0, pageSize: 5, pageNum: 1 })

  async function fetchExperiences(filter?: Record<string, any>) {
    try {
      const url = applyParamsToUrl('/api/experiences', filter)
      const data = await $fetch<any>(url)
      const { experiences, count, pageCount } = data
      items.value.all = experiences
      pagination.value.count = count
      pagination.value.pageCount = pageCount
      return experiences
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: 'Failed to load experiences. Please try again.',
        duration: 5000,
      })
      throw error
    }
  }

  async function fetchFeaturedExperiences(filter?: Record<string, any>) {
    try {
      const url = applyParamsToUrl('/api/experiences', filter)
      const data = await $fetch<any>(url)
      items.value.featured = data.experiences
      return items.value.featured
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: 'Failed to load featured experiences.',
        duration: 5000,
      })
      throw error
    }
  }

  async function fetchExperienceBySlug(slug: string) {
    try {
      const experience = await $fetch<any>(`/api/experiences/slug/${slug}`)
      item.value = experience
      return experience
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: `Failed to load experience "${slug}".`,
        duration: 5000,
      })
      throw error
    }
  }

  async function fetchExperienceById(id: string) {
    try {
      const experience = await $fetch<any>(`/api/experiences/${id}`)
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

  function setPage(currentPage: number) {
    pagination.value.pageNum = currentPage
  }

  return { items, item, pagination, fetchExperiences, fetchFeaturedExperiences, fetchExperienceBySlug, fetchExperienceById, setPage }
}, {
  persist: true,
})

function applyParamsToUrl(url: string, params?: Record<string, any>) {
  if (!params)
    return url
  const query = new URLSearchParams(params).toString()
  return query ? `${url}?${query}` : url
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useExperiencesStore, import.meta.hot))
