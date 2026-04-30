import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthenticationStore } from '~/composables/authentication'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthenticationStore()
  const isAuth: boolean = authStore.isAuthenticated

  if (!isAuth) {
    return navigateTo('/notAuthenticated')
  }
})
