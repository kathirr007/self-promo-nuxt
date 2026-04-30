<script setup lang="ts">
import type { TechnologiesUsedProps } from '~/types'
import { useAdminProjectStore } from '~/composables/admin/project'

const props = defineProps<TechnologiesUsedProps>()
const multiInputRef = ref<InstanceType<typeof import('~/components/form/MultiLineTextInput.vue').default> | null>(null)

// Use a local store action pattern — adapt to your actual admin store
const adminProjectStore = useAdminProjectStore()

function addLine(field: string) {
  adminProjectStore.addLine(field)
  nextTick(() => {
    const inputs = multiInputRef.value?.$el?.querySelectorAll('input')
    inputs?.[props.project.wsl.length - 1]?.focus()
  })
}

function removeLine(index: number, field: string) {
  adminProjectStore.removeLine(field, index)
}

function updateLine({ value, index }: { value: string, index: number }, field: string) {
  adminProjectStore.setLineValue(field, index, value)
}
</script>

<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <h2 class="card-header-title">
        Technologies used in this Project
      </h2>
    </header>
    <div class="card-content card-section">
      <form @submit.stop.prevent>
        <FormMultiLineTextInput
          ref="multiInputRef"
          :lines="project.wsl"
          add-btn="Add Technology"
          label="What Technologies used?"
          @value-updated="updateLine($event, 'wsl')"
          @add-clicked="addLine('wsl')"
          @remove-clicked="removeLine($event, 'wsl')"
        />
      </form>
    </div>
  </div>
</template>
