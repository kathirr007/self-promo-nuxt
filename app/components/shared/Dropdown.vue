<script setup lang="ts">
import type { DropdownProps } from '~/types'
defineProps<DropdownProps>()
const emit = defineEmits<{ optionChanged: [command: string] }>()

const isActive = ref(false)

function emitOption(e: Event, command: string) {
  e.preventDefault()
  ;(e as Event & { stopImmediatePropagation: () => void }).stopImmediatePropagation?.()
  emit('optionChanged', command)
}

function closeDropdown() {
  isActive.value = false
}
</script>

<template>
  <div class="dropdown" :class="{ 'is-active': isActive }" @keyup.esc="closeDropdown">
    <div class="dropdown-trigger">
      <div
        aria-haspopup="true"
        aria-controls="dropdown-menu"
        tabindex="0"
        role="link"
        aria-label="toggle-menu"
        @click="isActive = !isActive"
        @keyup.enter="isActive = !isActive"
        @keyup.space="isActive = !isActive"
      >
        <span />
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true" />
        </span>
      </div>
    </div>
    <div id="dropdown-menu" class="dropdown-menu">
      <div class="dropdown-content" role="menu">
        <a
          v-for="item in items"
          :key="item.name"
          role="menuitem"
          tabindex="0"
          class="dropdown-item"
          @click.prevent="emitOption($event, item.command)"
          @keyup.enter="emitOption($event, item.command)"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
    <div v-if="isActive" class="outside" @click="closeDropdown" @keyup.esc="closeDropdown" />
  </div>
</template>

<style scoped lang="scss">
.outside {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.dropdown-trigger:hover {
  cursor: pointer;
}

i {
  font-size: 25px;
  align-self: end;
}
</style>
