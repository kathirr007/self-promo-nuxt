import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const jquery = (window as any).$ || (window as any).jQuery || null
    if (jquery) {
      nuxtApp.provide('jquery', jquery)
      nuxtApp.vueApp.config.globalProperties.$jquery = jquery
    }
  }
})
