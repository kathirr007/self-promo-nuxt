<script setup lang="ts">
import type { PriceProps, PriceEmits } from '~/types'
defineProps<PriceProps>()
const emit = defineEmits<PriceEmits>()

function emitProjectValue(e: Event, field: string) {
  emit('projectValueUpdated', { value: (e.target as HTMLInputElement).value, field })
}
</script>

<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <p class="card-header-title">
        Pricing
      </p>
    </header>
    <div class="card-content card-section">
      <div class="field">
        <label class="label">Price of the project</label>
        <div class="control">
          <input :value="project.price" class="input" type="text" placeholder="179.99" @input="emitProjectValue($event, 'price')">
        </div>
      </div>
      <div class="field">
        <label class="label">Discounted Price for the project</label>
        <div class="control">
          <input :value="project.discountedPrice" class="input" type="text" placeholder="9.99" @input="emitProjectValue($event, 'discountedPrice')">
        </div>
      </div>
    </div>
  </div>
</template>
