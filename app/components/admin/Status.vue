<script setup lang="ts">
import type { StatusProps, StatusEmits } from '~/types'
defineProps<StatusProps>()
const emit = defineEmits<StatusEmits>()

function emitProjectValue(e: Event, field: string) {
  emit('projectValueUpdated', { value: (e.target as HTMLSelectElement).value, field })
}
</script>

<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <h2 class="card-header-title">
        Status
      </h2>
    </header>
    <div class="card-content card-section">
      <div class="field">
        <label class="label" for="projectStatus">Status</label>
        <div class="select">
          <select id="projectStatus" :value="project.status" @change="emitProjectValue($event, 'status')">
            <option value="active">
              Active
            </option>
            <option value="published">
              Published
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
