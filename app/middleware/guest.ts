import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  // const authStore = useAuthenticationStore()
  // const isAuth: boolean = authStore.isAuthenticated
  // const isLoggedIn: boolean = authStore.isAuthenticated
  const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()

  if (user.value) {
    return navigateTo('/')
  }
})
