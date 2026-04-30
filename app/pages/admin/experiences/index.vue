<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const router = useRouter()
const adminExperienceStore = useAdminExperienceStore()
const { createPublishedOptions, createDraftsOptions, commands } = await import('~/pages/admin/options')

// Use a timestamp-based key to force refetch on each page load
const fetchKey = `admin-experiences-${Date.now()}`

const { error, refresh } = await useAsyncData(fetchKey, async () => {
  try {
    return await adminExperienceStore.fetchUserExperiences()
  }
  catch (err) {
    console.error('Failed to fetch experiences:', err)
    throw err
  }
}, {
  server: true,
  default: () => ({ published: [], drafts: [] }),
})

onMounted(async () => {
  await refresh()
})

const published = computed(() => adminExperienceStore.items.published)
const drafts = computed(() => adminExperienceStore.items.drafts)
const activeTab = ref(0)

const draftsOptions = createDraftsOptions()

// Confirmation dialog
const { reveal: showDeleteConfirm, isRevealed: isDeleteRevealed, confirm: dialogConfirm, cancel: dialogCancel } = useConfirmDialog()
const dialogMessage = ref('')
const deleteTarget = ref<Record<string, any> | null>(null)
const isDeleting = ref(false)
const isTogglingFeature = ref(false)
const togglingExperienceId = ref<string | null>(null)

function publishedOptions(isFeatured: boolean) {
  return createPublishedOptions(isFeatured)
}

function displayExperienceTitle(experience: Record<string, any>): string {
  return experience.title || experience.subtitle || 'Experience without title or subtitle 😒'
}

function formatDate(date: string): string {
  return date ? new Date(date).toLocaleDateString() : ''
}

async function handleCommand(command: string, experience: Record<string, any>) {
  if (command === commands.EDIT_EXPERIENCE) {
    await router.push(`/admin/experience/${experience._id}/edit`)
  }
  if (command === commands.DELETE_EXPERIENCE) {
    deleteTarget.value = experience
    dialogMessage.value = `Are you sure you want to delete "${experience.title}"?`
    const { isCanceled } = await showDeleteConfirm()
    if (!isCanceled && deleteTarget.value) {
      isDeleting.value = true
      try {
        await adminExperienceStore.deleteExperience(deleteTarget.value)
        deleteTarget.value = null
      }
      finally {
        isDeleting.value = false
      }
    }
  }
  if (command === commands.TOGGLE_FEATURE) {
    const featured = !experience.featured
    isTogglingFeature.value = true
    togglingExperienceId.value = experience._id
    try {
      await adminExperienceStore.updatePublishedExperience(experience._id, { featured })
    }
    finally {
      isTogglingFeature.value = false
      togglingExperienceId.value = null
    }
  }
}
</script>

<template>
  <div>
    <SharedHeader title="Manage Experiences">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <NuxtLink to="/admin/experience/editor" class="button is-light m-r-md">
            New
          </NuxtLink>
          <NuxtLink to="/" class="button">
            <span class="icon"><i class="fas fa-home" /></span>
            <span>FrontEnd</span>
          </NuxtLink>
        </div>
      </template>
    </SharedHeader>
    <div class="admin-experiences">
      <div class="container">
        <section class="section">
          <div class="header-block">
            <h2 class="is-size-4-mobile">
              Experiences
            </h2>
            <div class="title-menu">
              <button class="button" @click="router.push('/admin/experience/editor')" @keyup.enter="router.push('/admin/experience/editor')">
                Add New <span class="is-hidden-mobile ml-1">Experience</span>
              </button>
            </div>
          </div>
          <div class="tabs">
            <ul role="tablist">
              <li role="tab" tabindex="0" @click="activeTab = 0" @keyup.enter="activeTab = 0">
                <a :class="{ 'is-active': activeTab === 0 }">Drafts</a>
              </li>
              <li role="tab" tabindex="0" @click="activeTab = 1" @keyup.enter="activeTab = 1">
                <a :class="{ 'is-active': activeTab === 1 }">Published</a>
              </li>
            </ul>
          </div>
          <div class="experiences-container">
            <template v-if="activeTab === 0">
              <div v-if="drafts && drafts.length > 0">
                <div v-for="experience in drafts" :key="experience._id" class="experience-card">
                  <h2>{{ displayExperienceTitle(experience) }}</h2>
                  <div class="experience-card-footer">
                    <span>Last Edited {{ formatDate(experience.updatedAt) }}</span>
                    <SharedDropdown :items="draftsOptions" @option-changed="handleCommand($event, experience)" />
                  </div>
                </div>
              </div>
              <transition v-else appear name="slideDown" mode="out-in">
                <div class="experience-error">
                  No Drafts <i class="far fa-frown" style="color: #58529f" />
                </div>
              </transition>
            </template>
            <template v-if="activeTab === 1">
              <div v-if="published && published.length > 0">
                <div
                  v-for="pexperience in published"
                  :key="pexperience._id"
                  class="experience-card"
                  :class="{ featured: pexperience.featured }"
                >
                  <h2>{{ displayExperienceTitle(pexperience) }}</h2>
                  <div class="experience-card-footer">
                    <span>Last Edited {{ formatDate(pexperience.updatedAt) }}</span>
                    <SharedDropdown 
                      :items="publishedOptions(pexperience.featured)" 
                      @option-changed="handleCommand($event, pexperience)" 
                    />
                  </div>
                </div>
              </div>
              <transition v-else appear name="slideDown" mode="out-in">
                <div class="experience-error">
                  No Published <i class="far fa-frown" style="color: #58529f" />
                </div>
              </transition>
            </template>
          </div>
        </section>
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
        title="Confirm Delete Experience"
      />
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.admin-experiences .tabs {
  margin-bottom: 0;
}
.is-active {
  border-bottom-color: #363636;
  color: #363636;
}
.experience-error {
  font-size: 35px;
  padding-top: 20px;
}
.experience-card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  h2 {
    font-size: 30px;
    font-weight: bold;
  }
  &-footer {
    color: rgba(0, 0, 0, 0.54);
  }
  &.featured {
    border-left: 5px solid #3cc314;
    padding-left: 10px;
    transition: border ease-out 0.2s;
  }
}
.header-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  > h2 {
    font-size: 40px;
    font-weight: bold;
  }
  .title-menu {
    margin-left: auto;
  }
}
</style>
