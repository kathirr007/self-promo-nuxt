import { defineNuxtPlugin } from '#app'
import NavLink from '~/components/shared/NavLink.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('NavLink', NavLink)
})
