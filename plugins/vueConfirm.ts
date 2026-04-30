import { defineNuxtPlugin } from '#app'

async function confirmDialog(message: string) {
  if (import.meta.client) {
    return window.confirm(message)
  }
  return false
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('confirmDialog', confirmDialog)
  nuxtApp.vueApp.config.globalProperties.$confirm = confirmDialog
})
