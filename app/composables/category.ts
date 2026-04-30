import { acceptHMRUpdate, defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', () => {
  const items = ref<any[]>([])

  const hasCategories = computed(() => items.value.length > 0)

  async function fetchCategories() {
    try {
      if (hasCategories.value)
        return
      const categories = await $fetch<any[]>('/api/categories')
      items.value = categories
      return categories
    }
    catch (error: any) {
      push.error({
        title: 'Fetch Failed',
        message: 'Failed to load categories. Please try again.',
        duration: 5000,
      })
      throw error
    }
  }

  return { items, hasCategories, fetchCategories }
}, {
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
