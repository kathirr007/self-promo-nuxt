<script setup lang="ts">
import slugify from 'slugify'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const router = useRouter()
const adminExperienceStore = useAdminExperienceStore()

await useAsyncData(`edit-experience-${route.params.id}`, () =>
  adminExperienceStore.fetchExperienceById(route.params.id as string))

const experience = computed(() => adminExperienceStore.item)
const isSaving = computed(() => adminExperienceStore.isSaving)

const publishError = ref('')
const slug = ref('')
const isGeneratingSlug = ref(false)
const isPublishing = ref(false)
const editorRef = ref<any>(null)

function getCurrentUrl(): string {
  return import.meta.client ? window.location.origin : ''
}

async function updateExperience(experienceData: Record<string, any>) {
  if (isSaving.value)
    return
  await adminExperienceStore.updateExperience(route.params.id as string, experienceData)
}

async function updateExperienceStatus({ closeModal }: { closeModal: () => void }, status: string) {
  const content = editorRef.value?.getContent?.() ?? {}
  content.status = status
  const message = status === 'published' ? 'Experience has been published!' : 'Experience has been un-published!'
  isPublishing.value = true
  try {
    await adminExperienceStore.updateExperience(route.params.id as string, content)
    closeModal()
    if (status === 'published')
      await router.push('/admin/experiences')
  }
  finally {
    isPublishing.value = false
  }
}

async function checkExperienceValidity() {
  const title = editorRef.value?.getNodeValueByName?.('title') ?? ''
  publishError.value = ''
  slug.value = ''

  if (!title || title.length < 10) {
    publishError.value = 'Cannot publish! Title needs to be longer than 10 characters!'
    return
  }

  isGeneratingSlug.value = true
  try {
    const generatedSlug = await $fetch('/api/experiences/generate-slug', {
      method: 'POST',
      body: {
        title,
        currentId: route.params.id as string,
      },
    })
    slug.value = generatedSlug
  }
  catch (error) {
    publishError.value = 'Failed to generate unique slug. Please try again.'
    console.error('Slug generation error:', error)
  }
  finally {
    isGeneratingSlug.value = false
  }
}

function initExperienceContent(editor: any) {
  if (experience.value && experience.value.content) {
    editorRef.value?.setEditorContent(experience.value.content)
  }
  else {
    editorRef.value?.setEditorContent(undefined)
  }
}
</script>

<template>
  <div>
    <SharedHeader title="Write your experience" exit-link="/admin/experiences">
      <template v-if="experience.status === 'active'" #actionMenu>
        <div class="full-page-takeover-header-button">
          <SharedModal
            open-title="Publish"
            open-btn-class="button is-success"
            title="Review Details"
            :is-loading="isPublishing"
            @opened="checkExperienceValidity"
            @submitted="updateExperienceStatus($event, 'published')"
          >
            <div>
              <div class="title">
                Once you publish experience you cannot change url to a experience.
              </div>
              <div v-if="!publishError">
                <div class="subtitle">
                  This is how url to experience post will look like after publish:
                </div>
                <div v-if="isGeneratingSlug" class="has-text-centered py-3">
                  <span class="icon">
                    <Icon name="line-md:loading-twotone-loop" class="text-xl" />
                  </span>
                  <span class="ml-2">Generating unique URL...</span>
                </div>
                <ClientOnly v-else>
                  <article class="message is-success">
                    <div class="message-body">
                      <strong>{{ getCurrentUrl() }}/experiences/{{ slug }}</strong>
                    </div>
                  </article>
                </ClientOnly>
              </div>
              <article v-else class="message is-danger">
                <div class="message-body">
                  {{ publishError }}
                </div>
              </article>
            </div>
          </SharedModal>
        </div>
      </template>
      <template v-else #actionMenu>
        <div class="full-page-takeover-header-button">
          <SharedModal
            open-title="Unpublish"
            open-btn-class="button is-warning"
            title="Unpublish Experience"
            :is-loading="isPublishing"
            @submitted="updateExperienceStatus($event, 'active')"
          >
            <div>
              <div class="title">
                Unpublish experience so it's no longer displayed in experiences page
              </div>
            </div>
          </SharedModal>
        </div>
      </template>
    </SharedHeader>
    <div class="experience-editor-container">
      <div class="container">
        <Editor
          ref="editorRef"
          :is-saving="isSaving"
          @editor-mounted="initExperienceContent"
          @editor-updated="updateExperience"
        />
      </div>
    </div>
  </div>
</template>
