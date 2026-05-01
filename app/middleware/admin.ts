import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthenticationStore } from '~/composables/authentication'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthenticationStore()
  const isAdmin: boolean = authStore.isAdmin

  if (!isAdmin) {
    return navigateTo('/notAuthorized')
  }
})
