<script setup lang="ts">
import type { MultiLineTextInputProps } from '~/types'

const props = withDefaults(defineProps<MultiLineTextInputProps>(), {
  addBtn: 'Add',
})

const emit = defineEmits<{
  addClicked: []
  removeClicked: [index: number]
  valueUpdated: [{ value: string, index: number }]
}>()

const multiInputRefs = ref<HTMLInputElement[]>([])

const lastLine = computed(() => props.lines[props.lines.length - 1])
const canAddLine = computed(() => props.lines.length === 0 || (!!lastLine.value && lastLine.value.value !== ''))
const canDeleteLine = computed(() => props.lines.length > 1)

function emitAdd() {
  if (canAddLine.value || props.lines.length === 0)
    emit('addClicked')
}

function emitRemove(index: number) {
  if (canDeleteLine.value)
    emit('removeClicked', index)
}

function emitUpdate(event: Event, index: number) {
  const value = (event.target as HTMLInputElement).value
  emit('valueUpdated', { value, index })
}
</script>

<template>
  <div>
    <label class="label">{{ label }}</label>
    <div v-for="(line, index) in lines" :key="index" class="multi-field field">
      <div class="control multi-control">
        <div class="multi-input-container">
          <label :for="`multi-input${index + 1}`" class="sr-only">{{ `Multi Input ${index + 1}` }}</label>
          <input
            :id="`multi-input${index + 1}`"
            :ref="el => { if (el) multiInputRefs[index] = el as HTMLInputElement }"
            :value="line.value"
            class="input multi-input"
            type="text"
            placeholder="Add Something Nice (:"
            @input="emitUpdate($event, index)"
            @keyup.enter.prevent="emitAdd()"
          >
        </div>
        <div class="btn-container">
          <button type="button" class="button m-l-sm is-danger multi-button" @click.prevent="emitRemove(index)">
            Delete
          </button>
        </div>
      </div>
    </div>
    <button type="button" class="m-b-sm button is-link is-outlined" @click="emitAdd()">
      {{ addBtn }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.multi-input {
  float: left;
  width: 100%;
}

.multi-button {
  height: inherit;
}

.multi-input-container {
  display: flex;
  flex: 1;
}

.btn-container {
  display: flex;
  opacity: 0;
}

.multi-control {
  display: flex;

  &:hover > .btn-container {
    opacity: 1;
  }
}
</style>
