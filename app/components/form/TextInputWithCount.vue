<script setup lang="ts">
import type { TextInputWithCountProps } from '~/types'

const props = withDefaults(defineProps<TextInputWithCountProps>(), {
  maxLength: 50,
  category: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'goNext': []
}>()

const route = useRoute()
const currentValue = ref('')

const inputLength = computed(() => currentValue.value.length)
const resolvedMaxLength = computed(() => props.maxLength ?? 50)

function emitInputValue(event: Event) {
  currentValue.value = (event.target as HTMLInputElement).value
  emit('update:modelValue', currentValue.value)
}

function _NextStep() {
  if (props.v.$invalid)
    return
  emit('goNext')
}
</script>

<template>
  <div class="pos-rel">
    <template v-if="'id' in route.params && route.params.id">
      <label for="categoryInput" class="sr-only">Category title</label>
      <input
        id="categoryInput"
        :maxlength="resolvedMaxLength"
        type="text"
        :value="category?.name"
        placeholder="e.g. Amazing Project in Flutter!"
        class="input is-large"
        @blur="v.$touch()"
        @input="emitInputValue"
      >
      <span class="icon is-small is-right">{{ resolvedMaxLength - inputLength }}</span>
    </template>
    <template v-else>
      <label for="categoryInput" class="sr-only">Category title</label>
      <input
        id="categoryInput"
        :maxlength="resolvedMaxLength"
        type="text"
        placeholder="e.g. Amazing Project using Nuxt.js!"
        class="input is-large"
        @blur="v.$touch()"
        @input="emitInputValue"
        @keydown.enter.prevent="_NextStep"
      >
      <span class="icon is-small is-right">{{ resolvedMaxLength - inputLength }}</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.pos-rel {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

.icon {
  color: #757575;
}
</style>
