import type { Directive, DirectiveBinding } from 'vue'
import { defineNuxtPlugin } from '#app'

interface TooltipElement extends HTMLElement {
  __tooltipNode__?: HTMLElement
  __showTooltip__?: EventListener
  __hideTooltip__?: EventListener
}

function createTooltipNode(text: string) {
  const tooltip = document.createElement('div')
  tooltip.textContent = text
  tooltip.style.position = 'fixed'
  tooltip.style.padding = '0.5rem 0.75rem'
  tooltip.style.fontSize = '0.875rem'
  tooltip.style.color = '#fff'
  tooltip.style.background = 'rgba(0, 0, 0, 0.75)'
  tooltip.style.borderRadius = '0.375rem'
  tooltip.style.pointerEvents = 'none'
  tooltip.style.whiteSpace = 'nowrap'
  tooltip.style.zIndex = '10000'
  tooltip.style.opacity = '0'
  tooltip.style.transition = 'opacity 0.15s ease'
  document.body.appendChild(tooltip)
  return tooltip
}

const tooltipDirective: Directive = {
  mounted(el: TooltipElement, binding: DirectiveBinding) {
    if (import.meta.server)
      return

    const text = binding.value || el.getAttribute('title') || ''
    if (!text)
      return

    el.removeAttribute('title')
    el.__tooltipNode__ = createTooltipNode(text)

    el.__showTooltip__ = (event: MouseEvent) => {
      const tooltip = el.__tooltipNode__
      if (!tooltip)
        return

      const x = event.clientX + 12
      const y = event.clientY + 12
      tooltip.style.left = `${x}px`
      tooltip.style.top = `${y}px`
      tooltip.style.opacity = '1'
    }

    el.__hideTooltip__ = () => {
      if (el.__tooltipNode__) {
        el.__tooltipNode__.style.opacity = '0'
      }
    }

    el.addEventListener('mouseenter', el.__showTooltip__)
    el.addEventListener('mousemove', el.__showTooltip__)
    el.addEventListener('mouseleave', el.__hideTooltip__)
  },
  unmounted(el: TooltipElement) {
    if (el.__tooltipNode__) {
      el.__tooltipNode__.remove()
      delete el.__tooltipNode__
    }
    if (el.__showTooltip__) {
      el.removeEventListener('mouseenter', el.__showTooltip__)
      el.removeEventListener('mousemove', el.__showTooltip__)
    }
    if (el.__hideTooltip__) {
      el.removeEventListener('mouseleave', el.__hideTooltip__)
    }
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tooltip', tooltipDirective)
})
