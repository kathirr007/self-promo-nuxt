<script setup lang="ts">
const emit = defineEmits<{
  stepUpdated: [{ data: { category: string }, isValid: boolean }]
}>()

const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.items)

const form = reactive({ category: 'default' })
const isDirty = ref(false)

const isValid = computed(() => form.category !== 'default' && form.category !== '')

function emitFormData() {
  isDirty.value = true
  emit('stepUpdated', { data: { ...form }, isValid: isValid.value })
}
</script>

<template>
  <div class="project-create-wrapper">
    <div class="project-create-headerText">
      What category best fits the knowledge you'll share?
    </div>
    <h2 class="project-create-subtitle">
      If you're not sure about the right category, you can change it later.
    </h2>
    <form class="project-create-form">
      <div class="project-create-form-group">
        <div class="project-create-form-field">
          <div class="select is-large">
            <select v-model="form.category" @change="emitFormData" @blur="isDirty = true">
              <option value="default">
                Select Category
              </option>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
            <div v-if="isDirty && !isValid" class="form-error">
              <span class="help is-danger">Category is required</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.help.is-danger {
  text-align: left;
}
</style>
