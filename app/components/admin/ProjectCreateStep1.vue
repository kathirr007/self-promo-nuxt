<script setup lang="ts">
import type { ProjectCreateStep1Emits, ProjectCreateStep1Props } from '~/types'

const props = defineProps<ProjectCreateStep1Props>()
const emit = defineEmits<ProjectCreateStep1Emits>()
const route = useRoute()
const categoryFormRef = ref<HTMLFormElement | null>(null)
const textInputRef = ref<InstanceType<typeof import('~/components/form/TextInputWithCount.vue').default> | null>(null)

const form = reactive({ title: '' })
const titleError = ref('')

const isValid = computed(() => form.title.length >= 10 && form.title.length <= 100)

const fakeV = reactive({
  $touch: () => {
    titleError.value = form.title.length < 10 ? 'Title should be minimum 10 characters' : ''
  },
  get $invalid() { return !isValid.value },
  $params: { minLength: { min: 10 } },
  get required() { return form.title.length > 0 },
  get minLength() { return form.title.length >= 10 },
})

function emitFormData() {
  emit('stepUpdated', { data: { ...form }, isValid: isValid.value })
}

function emitFormData2() {
  emit('fromCategories', { data: { ...form }, isValid: isValid.value })
  form.title = ''
  titleError.value = ''
  categoryFormRef.value?.reset()
}

function _NextStep() {
  emit('goNext')
}
</script>

<template>
  <div class="project-create-wrapper">
    <div class="project-create-headerText">
      <template v-if="'id' in route.params && route.params.id">
        Please provide updated name of your Category.
      </template>
      <template v-else-if="route.path.includes('categor')">
        Please choose name of your Category.
      </template>
      <template v-else>
        Please choose title of your Project.
      </template>
    </div>
    <h2 class="project-create-subtitle">
      <template v-if="'id' in route.params && route.params.id">
        No worries, you can change name later again.
      </template>
      <template v-else-if="route.path.includes('categor')">
        No worries, you can change name later.
      </template>
      <template v-else>
        No worries, you can change title later.
      </template>
    </h2>
    <form ref="categoryFormRef" class="project-create-form" @input="emitFormData" @submit.prevent>
      <div class="project-create-form-group">
        <div class="field project-create-form-field control has-icons-right has-addons">
          <FormTextInputWithCount
            ref="textInputRef"
            v-model="form.title"
            :category="category ?? undefined"
            :v="fakeV"
            :max-length="100"
            @go-next="_NextStep"
          />
          <button
            class="create-category control is-large button is-success"
            :class="route.path.includes('categories') && isValid ? 'active m-l-md' : ''"
            @click.prevent="emitFormData2"
            @keyup.enter="emitFormData2"
          >
            Create
          </button>
        </div>
      </div>
      <div v-if="titleError" class="form-error">
        <span class="help is-danger">{{ titleError }}</span>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.create-category {
  opacity: 0;
  width: 0;
  padding: 0;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    width: auto;
    padding: 0 1em;
  }
}

.project-create-form {
  .project-create-form-field {
    width: 100%;
  }
  margin-bottom: 15px;

  .form-error {
    text-align: left;
    .help {
      color: #993918;
    }
  }
}
</style>
