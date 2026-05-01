<script setup lang="ts">
interface Props {
  openTitle?: string
  title?: string
  actionTitle?: string
  removeActionTitle?: string
  openBtnClass?: string
  showButton?: boolean
  isDisabled?: boolean
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  openTitle: 'Open',
  title: 'Hey There',
  actionTitle: 'Commit',
  removeActionTitle: undefined,
  openBtnClass: 'button',
  showButton: true,
  isDisabled: false,
  isLoading: false,
})

const emit = defineEmits<{
  submitted: [{ closeModal: () => void }]
  deleted: [{ closeModal: () => void }]
  opened: []
}>()

const isOpen = ref(false)

function closeCallback() {
  isOpen.value = false
}

function emitAction() {
  emit('submitted', { closeModal: closeCallback })
}

function emitDeleteAction() {
  emit('deleted', { closeModal: closeCallback })
}

function openModal() {
  isOpen.value = true
  emit('opened')
}

defineExpose({
  openModal,
})
</script>

<template>
  <div>
    <div v-if="showButton" @click="openModal">
      <slot name="submitBtn">
        <button :class="openBtnClass">
          {{ openTitle }}
        </button>
      </slot>
    </div>
    <div class="modal animated" :class="[isOpen ? 'is-active' : 'slideOutUp']">
      <div class="modal-background" />
      <div class="modal-card animated" :class="[isOpen ? 'slideInDown' : '']">
        <header class="modal-card-head">
          <h2 class="modal-card-title">
            {{ title }}
          </h2>
          <button class="delete" aria-label="close" @click="isOpen = false" />
        </header>
        <section class="modal-card-body">
          <div class="content">
            <slot />
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            :disabled="isDisabled || isLoading"
            class="button is-success m-r-md"
            :class="{ 'is-loading': isLoading }"
            @click="emitAction"
          >
            {{ isLoading ? 'Processing...' : actionTitle }}
          </button>
          <button
            v-if="removeActionTitle"
            :disabled="isLoading"
            class="button is-danger m-r-md"
            :class="{ 'is-loading': isLoading }"
            @click="emitDeleteAction"
          >
            {{ isLoading ? 'Processing...' : removeActionTitle }}
          </button>
          <button class="button" :disabled="isLoading" @click="isOpen = false">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-card-body {
  color: black;
}

.modal {
  z-index: 9999;
  display: block;
  &.is-active {
    display: flex;
  }
}

@keyframes slideOutUp {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -100%, 0);
  }
}
</style>
