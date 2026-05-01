<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const router = useRouter()
const categoryStore = useAdminCategoryStore()
const categories = computed(() => categoryStore.items)

// Use a timestamp-based key to force refetch on each page load
const fetchKey = `admin-categories-${Date.now()}`

const { error, refresh } = await useAsyncData(fetchKey, async () => {
  try {
    return await categoryStore.fetchAdminCategories()
  }
  catch (err) {
    console.error('Failed to fetch categories:', err)
    throw err
  }
}, {
  server: true,
  default: () => [],
})

// Log any errors for debugging
if (error.value) {
  console.error('Failed to fetch categories:', error.value)
}

onMounted(async () => {
  await refresh()
})

const canProceed = ref(false)
const form = reactive({ title: '' })
const isCreating = ref(false)
const isDeleting = ref(false)
const deletingCategoryId = ref<string | null>(null)

// Confirmation dialog using VueUse
const { reveal: showDeleteConfirm, isRevealed: isDeleteRevealed, confirm: dialogConfirm, cancel: dialogCancel } = useConfirmDialog()
const deleteTarget = ref<Record<string, any> | null>(null)
const dialogMessage = ref('')

function mergeFormData({ data, isValid }: { data: { title: string }, isValid: boolean }) {
  Object.assign(form, data)
  canProceed.value = isValid
}

async function createCategory() {
  isCreating.value = true
  try {
    await categoryStore.createCategory2({ name: form.title })
    const input = document.querySelector<HTMLInputElement>('.pos-rel input')
    input?.focus()
  }
  finally {
    isCreating.value = false
  }
}

async function deleteCategory(category: Record<string, any>) {
  deleteTarget.value = category
  dialogMessage.value = `Are you sure you want to delete "${category.name}"?`
  const { isCanceled } = await showDeleteConfirm()
  if (!isCanceled && deleteTarget.value) {
    isDeleting.value = true
    deletingCategoryId.value = deleteTarget.value._id
    try {
      await categoryStore.deleteCategory(deleteTarget.value)
      deleteTarget.value = null
    }
    finally {
      isDeleting.value = false
      deletingCategoryId.value = null
    }
  }
}
</script>

<template>
  <div>
    <SharedHeader title="Manage Categories">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <NuxtLink to="/admin/category/create" class="button is-light m-r-md">
            New Category
          </NuxtLink>
          <NuxtLink to="/" class="button">
            <span class="icon"><i class="fas fa-home" /></span>
            <span>FrontEnd</span>
          </NuxtLink>
        </div>
      </template>
    </SharedHeader>
    <div class="projects-page">
      <div class="container">
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <AdminProjectCreateStep1 @step-updated="mergeFormData" @from-categories="createCategory" />
            <h1 class="projects-page-title">
              Available Categories
            </h1>
            <TransitionGroup tag="ul" name="slideDown" role="list" class="categories-list list is-hoverable">
              <li
                v-for="(category, i) in categories"
                :key="category._id"
                class="list-item"
                role="listitem"
                tabindex="0"
              >
                {{ i + 1 }}. {{ category.name }}
                <span class="tags is-pulled-right">
                  <NuxtLink class="tag is-info" :to="`/admin/category/${category._id}`" role="button" tabindex="0">Update</NuxtLink>
                  <span 
                    class="tag is-danger" 
                    role="button" 
                    tabindex="0" 
                    :class="{ 'is-loading': isDeleting && deletingCategoryId === category._id }"
                    @click="deleteCategory(category)" 
                    @keyup.enter="deleteCategory(category)"
                  >
                    {{ isDeleting && deletingCategoryId === category._id ? 'Deleting...' : 'Delete' }}
                  </span>
                </span>
              </li>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <Teleport to="body">
      <SharedConfirmDialog
        v-if="isDeleteRevealed"
        :message="dialogMessage"
        :is-revealed="isDeleteRevealed"
        :confirm="dialogConfirm"
        :cancel="dialogCancel"
        title="Confirm Delete Category"
      />
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.projects-page {
  padding-top: 60px;
  &-title {
    font-size: 40px;
    font-weight: bold;
    padding-bottom: 20px;
  }
  .tag {
    text-transform: capitalize;
    cursor: pointer;
  }
}
.categories-list.list {
  background-color: #fff;
  border-radius: 4px;
  box-shadow:
    0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  .list-item {
    display: block;
    padding: 0.5em 1em;
    .tag {
      opacity: 0;
      transform: scale(1, 0);
      transform-origin: center bottom;
      transition: all 0.25s ease-in;
    }
    &:not(a) {
      color: #4a4a4a;
    }
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    &:not(:last-child) {
      border-bottom: 1px solid #dbdbdb;
    }
    &:hover .tag {
      opacity: 1;
      transform: scale(1, 1);
    }
  }
}
</style>
