import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAuthenticationStore = defineStore('authentication', () => {
  const { loggedIn, user, session, fetch: fetchUserSession, clear: clearUserSession, openInPopup } = useUserSession()

  const authUser = computed<SessionUser | null>(() => (user.value as SessionUser) ?? null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => (user.value as SessionUser)?.role === 'admin')

  async function login(loginData: Record<string, any>) {
    try {
      await $fetch<Record<string, any>>('/api/auth/login', { method: 'POST', body: loginData })
      await fetchUserSession()
      const currentUser = user.value as SessionUser
      push.success({
        title: 'Login Successful',
        message: `Welcome Back ${currentUser?.name}...!`,
      })
      return user.value
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Login failed. Please check your credentials.'
      push.error({
        title: 'Login Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function resetPassword(resetData: Record<string, any>) {
    try {
      await $fetch('/api/auth/resetPassword', { method: 'POST', body: resetData })
      push.success({
        title: 'Password Reset',
        message: 'Your password has been reset successfully. Please login with your new password.',
        duration: 5000,
      })
      return true
    }
    catch (error: any) {
      const message = error?.data?.message ?? 'Password reset failed. Please try again.'
      push.error({
        title: 'Reset Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await clearUserSession()
      push.success({
        title: 'Logout',
        message: 'You have been successfully logged out.',
        duration: 3000,
      })
    }
    catch (error: any) {
      push.error({
        title: 'Logout Failed',
        message: 'There was a problem logging you out. Please try again.',
        duration: 5000,
      })
    }
  }

  async function register(registerData: Record<string, any>) {
    try {
      await $fetch('/api/auth/register', { method: 'POST', body: registerData })
      push.success({
        title: 'Registration Successful',
        message: 'Your account has been created. Please login to continue.',
        duration: 5000,
      })
      return true
    }
    catch (error: any) {
      const message = error?.data?.errors?.message ?? error?.data?.message ?? 'Registration failed. Please try again.'
      push.error({
        title: 'Registration Failed',
        message,
        duration: 5000,
      })
      throw new Error(message)
    }
  }

  return { user, loggedIn, session, authUser, isAuthenticated, isAdmin, login, resetPassword, logout, register, fetch: fetchUserSession, clear: clearUserSession, openInPopup }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthenticationStore, import.meta.hot))
