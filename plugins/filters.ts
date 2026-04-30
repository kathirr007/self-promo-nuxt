import { format, parseISO } from 'date-fns'
import { defineNuxtPlugin } from '#app'

const filters = {
  shortenText(value: unknown, maxLength = 300) {
    if (typeof value === 'string') {
      const suffix = value.length > maxLength ? '...' : ''
      return value.substr(0, maxLength) + suffix
    }
    return ''
  },
  formatDate(value: unknown, dateFormat = 'LLLL dd, yyyy hh:mm aa') {
    if (!value)
      return ''
    try {
      return format(parseISO(String(value)), dateFormat)
    }
    catch {
      return String(value)
    }
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('filters', filters)
  nuxtApp.vueApp.config.globalProperties.$filters = filters
})
