import { reactive, readonly } from 'vue'
import { defineNuxtPlugin } from '#app'

const modalState = reactive({
  isOpen: false,
  component: null as any,
  props: {} as Record<string, unknown>,
})

function openModal(component: any, props: Record<string, unknown> = {}) {
  modalState.component = component
  modalState.props = props
  modalState.isOpen = true
}

function closeModal() {
  modalState.isOpen = false
  modalState.component = null
  modalState.props = {}
}

export default defineNuxtPlugin((nuxtApp) => {
  const modal = {
    state: readonly(modalState),
    openModal,
    closeModal,
  }

  nuxtApp.provide('modal', modal)
  nuxtApp.vueApp.config.globalProperties.$modal = modal
})
