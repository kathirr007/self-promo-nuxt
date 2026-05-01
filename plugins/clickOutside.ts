import type { Directive } from 'vue'
import { defineNuxtPlugin } from '#app'

interface ClickOutsideElement extends HTMLElement {
  __clickOutsideHandler__?: EventListenerOrEventListenerObject
}

export default defineNuxtPlugin((nuxtApp) => {
  const clickOutside: Directive = {
    mounted(el: ClickOutsideElement, binding) {
      el.__clickOutsideHandler__ = (event: Event) => {
        if (!el.contains(event.target as Node) && el !== event.target) {
          if (typeof binding.value === 'function') {
            binding.value(event)
          }
        }
      }
      document.addEventListener('click', el.__clickOutsideHandler__)
    },
    unmounted(el: ClickOutsideElement) {
      if (el.__clickOutsideHandler__) {
        document.removeEventListener('click', el.__clickOutsideHandler__)
        delete el.__clickOutsideHandler__
      }
    },
  }

  nuxtApp.vueApp.directive('click-outside', clickOutside)
})
