<script setup lang="ts">
import type { NotivueItem } from 'notivue'

interface ExtendedNotivueItem extends NotivueItem {
  hideClose?: boolean
  closeAriaLabel?: string
}

defineProps<{
  item: ExtendedNotivueItem
}>()
</script>

<template>
  <div class="nv-notifications" :class="item.type">
    <div class="nv-notification-content">
      <div v-if="item.title" class="nv-notification-title" v-html="item.title" />
      <div class="nv-notification-message" v-html="item.message" />
      <button
        v-if="!item.hideClose"
        class="nv-notification-close"
        :aria-label="item.closeAriaLabel || 'Close'"
        @click="item.clear"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
    <slot :item="item" />
  </div>
</template>

<style scoped>
.nv-notifications {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  /* Bulma width utilities: is-max-desktop for max-width */
  width: 100%;
  max-width: 400px;
  min-width: 280px;
}

/* Responsive width using Bulma breakpoints */
@media screen and (min-width: 769px) {
  .nv-notifications {
    min-width: 320px;
    max-width: 450px;
  }
}

.nv-notifications.success {
  background: #10b981;
  color: white;
}

.nv-notifications.error {
  background: #ef4444;
  color: white;
}

.nv-notifications.info {
  background: #3b82f6;
  color: white;
}

.nv-notifications.warning {
  background: #f59e0b;
  color: white;
}

.nv-notification-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  /* Height should adjust based on content */
  min-height: auto;
  padding-right: 2rem;
}

.nv-notification-title {
  font-weight: 600;
  /* Bulma size: is-size-7 equivalent */
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.nv-notification-message {
  /* Bulma size: is-size-7 equivalent */
  font-size: 0.875rem;
  line-height: 1.25rem;
  opacity: 0.9;
  /* Allow text to wrap and height to adjust */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.nv-notification-message :deep(strong) {
  font-weight: 700;
}

.nv-notification-message :deep(.has-text-white) {
  color: white;
}

.nv-notification-message :deep(.ml-2) {
  margin-left: 0.5rem;
}

.nv-notification-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  /* Bulma spacing: p-1 equivalent */
  padding: 0.25rem;
  /* Bulma radius: is-radiusless or custom */
  border-radius: 0.375rem;
  color: currentColor;
  opacity: 0.7;
  transition: opacity 0.2s;
  /* Fixed width and height for the close button */
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nv-notification-close:hover {
  opacity: 1;
}
</style>
