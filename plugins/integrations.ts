import { defineNuxtPlugin } from '#app'

function applyParamsToUrl(url: string, filter?: Record<string, unknown>) {
  if (!filter || Object.keys(filter).length === 0) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'
  const query = Object.entries(filter)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  return `${url}${separator}${query}`
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      applyParamsToUrl,
    },
  }
})
