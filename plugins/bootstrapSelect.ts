import type { Directive } from 'vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const bootstrapSelect: Directive = {
    mounted(el) {
      if (el.tagName === 'SELECT') {
        el.classList.add('form-select')
      }
    },
  }

  nuxtApp.vueApp.directive('bootstrap-select', bootstrapSelect)
})
