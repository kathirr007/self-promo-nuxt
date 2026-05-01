<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const router = useRouter()
const categoryStore = useAdminCategoryStore()

const { data: category } = await useAsyncData(`category-${route.params.id}`, () =>
  categoryStore.fetchCategoryById(route.params.id as string))

const canProceed = ref(false)
const isUpdating = ref(false)
const form = reactive({ title: '' })

function mergeFormData({ data, isValid }: { data: { title: string }, isValid: boolean }) {
  Object.assign(form, data)
  canProceed.value = isValid
}

async function updateCategory() {
  if (!category.value)
    return
  isUpdating.value = true
  try {
    await categoryStore.updateCategory({ ...category.value, name: form.title || category.value.name })
    await router.push('/admin/categories')
  }
  finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <div class="full-page-takeover-window">
    <div class="full-page-takeover-page">
      <SharedHeader title="Update Category" exit-link="/admin/categories" />
      <div class="project-create full-page-takeover-container">
        <div class="container">
          <AdminProjectCreateStep1
            :category="category ?? undefined"
            @step-updated="mergeFormData"
          />
        </div>
        <div class="full-page-footer-row">
          <div class="container">
            <div class="full-page-footer-col">
              <div class="empty-container" />
            </div>
            <div class="full-page-footer-col">
              <button 
                :disabled="!canProceed || isUpdating" 
                class="button is-success float-right" 
                :class="{ 'is-loading': isUpdating }"
                @click="updateCategory"
              >
                {{ isUpdating ? 'Updating...' : 'Update' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.float-right {
  float: right;
}
.empty-container {
  width: 1px;
  height: 1px;
}
.project-create {
  &-wrapper {
    margin-top: 60px;
    text-align: center;
  }
  &-headerText {
    font-weight: 300;
    line-height: 1.1;
    margin-top: 21px;
    margin-bottom: 10.5px;
    font-size: 36px;
  }
  &-subtitle {
    font-size: 24px;
    font-weight: 300;
    margin-top: 21px;
    margin-bottom: 10.5px;
  }
  &-form {
    margin-top: 60px;
    &-group {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .select {
      width: 100%;
      > select {
        width: 100%;
      }
    }
  }
}
</style>
