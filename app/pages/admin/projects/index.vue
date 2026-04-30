<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const router = useRouter()
const adminProjectStore = useAdminProjectStore()
const projects = computed(() => adminProjectStore.items)

// Use a timestamp-based key to force refetch on each page load
const fetchKey = `admin-projects-${Date.now()}`

const { error, refresh } = await useAsyncData(fetchKey, async () => {
  try {
    return await adminProjectStore.fetchAdminProjects()
  }
  catch (err) {
    console.error('Failed to fetch projects:', err)
    throw err
  }
}, {
  server: true,
  default: () => [],
})

// Log any errors for debugging
if (error.value) {
  console.error('Failed to fetch projects:', error.value)
}

onMounted(async () => {
  await refresh()
})

// Confirmation dialog
const { reveal: showDeleteConfirm, isRevealed: isDeleteRevealed, confirm: dialogConfirm, cancel: dialogCancel } = useConfirmDialog()
const dialogMessage = ref('')
const deleteTarget = ref<Record<string, any> | null>(null)
const isDeleting = ref(false)
const deletingProjectId = ref<string | null>(null)

function projectStatusClass(status: string): string {
  if (status === 'published')
    return 'is-success'
  if (status === 'active')
    return 'is-primary'
  if (status === 'inactive')
    return 'is-warning'
  if (status === 'deleted')
    return 'is-danger'
  return ''
}

const selectedProject = ref<Record<string, any> | null>(null)

function handleTabKey(project: Record<string, any>) {
  if (!selectedProject.value || selectedProject.value._id !== project._id) {
    selectedProject.value = project
  }
}

function clearSelectedProject() {
  selectedProject.value = null
}

async function deleteProject(project: Record<string, any>) {
  deleteTarget.value = project
  dialogMessage.value = `Are you sure you want to delete "${project.title}"?`
  const { isCanceled } = await showDeleteConfirm()
  if (!isCanceled && deleteTarget.value) {
    isDeleting.value = true
    deletingProjectId.value = deleteTarget.value._id
    try {
      await adminProjectStore.deleteProject(deleteTarget.value)
      deleteTarget.value = null
    }
    finally {
      isDeleting.value = false
      deletingProjectId.value = null
    }
  }
}
</script>

<template>
  <div>
    <SharedHeader title="Manage Projects">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <NuxtLink to="/admin/project/create" class="button is-light m-r-md">
            New Project
          </NuxtLink>
          <NuxtLink to="/" class="button">
            <span class="icon"><i class="fas fa-home" /></span>
            <span>FrontEnd</span>
          </NuxtLink>
        </div>
      </template>
    </SharedHeader>
    <main class="projects-page">
      <div class="container">
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <h1 class="projects-page-title">
              Projects
            </h1>
            <div v-for="project in projects" :key="project._id" class="tile is-ancestor m-b-sm">
              <div class="tile p-sm is-12">
                <div
                  class="tile tile-overlay-container is-child box"
                  tabindex="0"
                  aria-label="overlay-container"
                  :class="{ focused: selectedProject && selectedProject._id === project._id }"
                  @keyup.tab="handleTabKey(project)"
                  @keyup.esc="clearSelectedProject"
                  @blur="clearSelectedProject"
                >
                  <div class="tile-overlay">
                    <NuxtLink :to="`/admin/project/${project._id}/manage`" class="tile-overlay-text">
                      <span>Update Project</span>
                    </NuxtLink>
                    <span
                      class="tile-overlay-text has-text-danger"
                      role="button"
                      tabindex="0"
                      :class="{ 'is-loading': isDeleting && deletingProjectId === project._id }"
                      @click="deleteProject(project)"
                      @keyup.enter="deleteProject(project)"
                    >
                      {{ isDeleting && deletingProjectId === project._id ? 'Deleting...' : 'Delete Project' }}
                    </span>
                  </div>
                  <div class="columns">
                    <div class="column is-narrow">
                      <figure class="image is-4by2 is-128x128">
                        <img
                          :alt="project.title"
                          :src="project.image || 'https://dummyimage.com/200x200/9e9e9e/ffffff&text=No+Image'"
                        >
                      </figure>
                    </div>
                    <div class="column">
                      <h2 class="title">
                        {{ project.title }}
                      </h2>
                      <p class="subtitle">
                        {{ project.subtitle || 'No subtitle provided yet' }}
                      </p>
                      <span class="tag" :class="projectStatusClass(project.status)">{{ project.status }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Confirmation Dialog -->
    <Teleport to="body">
      <SharedConfirmDialog
        v-if="isDeleteRevealed"
        :message="dialogMessage"
        :is-revealed="isDeleteRevealed"
        :confirm="dialogConfirm"
        :cancel="dialogCancel"
        title="Confirm Delete Project"
      />
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
figure.image.is-128x128 {
  img {
    height: 100%;
    object-fit: contain;
    object-position: top;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
  }
}
.tile-overlay-container {
  position: relative;
  &.focused,
  &:hover {
    box-shadow: none;
    > .tile-overlay {
      background-color: rgba(255, 255, 255, 0.9);
    }
    .tile-overlay-text {
      visibility: visible;
    }
  }
  .tile-overlay {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    bottom: 0;
    width: auto;
    right: 0;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    @media screen and (max-width: 768px) {
      flex-flow: column;
    }
    &-text {
      color: #58529f;
      visibility: hidden;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 700;
      white-space: nowrap;
    }
  }
}
.projects-page {
  padding-top: 60px;
  &-title {
    font-size: 40px;
    font-weight: bold;
    padding-bottom: 20px;
  }
  .tag {
    text-transform: capitalize;
  }
}
</style>
