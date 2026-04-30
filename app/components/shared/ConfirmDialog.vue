<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  message?: string
  isRevealed: boolean
  confirm?: () => void
  cancel?: () => void
  confirmBtnText?: string
  cancelBtnText?: string
}>(), {
  title: 'Confirmation',
  confirmBtnText: 'Yes',
  cancelBtnText: 'No',
})

function handleConfirm() {
  if (props.confirm) {
    props.confirm()
  }
}

function handleCancel() {
  if (props.cancel) {
    props.cancel()
  }
}
</script>

<template>
  <div v-if="props.isRevealed" class="modal is-active" style="--bulma-modal-card-head-padding: 1rem;">
    <div class="modal-background" @click="handleCancel" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ title }}
        </p>
      </header>
      <section class="modal-card-body" :style="{ '--bulma-modal-card-body-padding': '1rem' }">
        {{ props.message }}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success m-r-md" @click="handleConfirm">
          {{ confirmBtnText }}
        </button>
        <button class="button" @click="handleCancel">
          {{ cancelBtnText }}
        </button>
      </footer>
    </div>
  </div>
</template>
