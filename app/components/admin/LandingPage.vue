<script setup lang="ts">
import type { LandingPageEmits, LandingPageProps } from '~/types'

const props = defineProps<LandingPageProps>()

const emit = defineEmits<LandingPageEmits>()

const adminProjectStore = useAdminProjectStore()
const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.items)

const uploadedFiles = ref<ImageItem[]>([])
const imagesInput = ref<HTMLInputElement | null>(null)
const image = ref<string[]>([])
const filesToSubmit = ref<File[]>([])
const selectedFilesCount = ref(0)
const selectedFileName = ref('')

const titleError = ref('')
const titleTouched = ref(false)

const titleValid = computed(() => props.project.title?.length >= 10)

// Track if we're showing newly selected files vs server-uploaded files
const hasNewFiles = ref(false)

onMounted(() => {
  loadExistingImages()
  titleTouched.value = true
})

// Watch for changes in project.images to refresh after save
watch(() => props.project?.images, (newImages, oldImages) => {
  // Check if images changed from Files to uploaded objects with location
  const hasLocation = newImages && Array.isArray(newImages) && newImages.length > 0 && typeof newImages[0]?.location !== 'undefined'

  // Reload if we now have server-uploaded images (with location property)
  if (hasLocation) {
    loadExistingImages()
  }
}, { deep: true, immediate: false })

function loadExistingImages() {
  const firstImage = props.project.images?.at(0)
  if (firstImage !== undefined && typeof firstImage.location !== 'undefined') {
    uploadedFiles.value = [...props.project.images]
    /* selectedFilesCount.value = uploadedFiles.value.length
    selectedFileName.value = uploadedFiles.value.length === 1
      ? (uploadedFiles.value[0]?.originalname ?? 'No file chosen')
      : 'No file chosen' */
    // Clear any temporary blob URLs
    image.value = []
    filesToSubmit.value = []
    hasNewFiles.value = false
  }
}

function formatNames(filesCount: number): string {
  if (filesCount === 0)
    return 'No file chosen'
  if (filesCount === 1)
    return selectedFileName.value
  return `${filesCount} files selected`
}

function imagesAdd(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files ?? [])
  image.value = files.map(f => URL.createObjectURL(f))
  filesToSubmit.value = files
  selectedFilesCount.value = files.length
  selectedFileName.value = files.length === 1 ? (files[0]?.name ?? '') : ''
  hasNewFiles.value = true
  adminProjectStore.updateUploadedFiles(uploadedFiles)
}

function removeImage(index: number) {
  image.value.splice(index, 1)
  filesToSubmit.value.splice(index, 1)
  selectedFilesCount.value = filesToSubmit.value.length

  // Update filename based on remaining files
  if (selectedFilesCount.value === 0) {
    selectedFileName.value = ''
    hasNewFiles.value = false
  }
  else if (selectedFilesCount.value === 1 && filesToSubmit.value.length === 1) {
    selectedFileName.value = filesToSubmit.value[0]?.name || ''
  }
  else {
    selectedFileName.value = ''
  }
}

async function removeS3Image(index: number, field: string) {
  const item = uploadedFiles.value.at(index)
  if (!item)
    return

  // Extract S3 key from the location URL
  // URL format: https://bucket.s3.region.amazonaws.com/folder/filename.jpg
  // We need: folder/filename.jpg
  let s3Key = ''
  let key = ''
  try {
    const url = new URL(item.location)
    // Remove leading slash if present
    s3Key = url.pathname.substring(1)
    key = s3Key.substring(s3Key.lastIndexOf('/') + 1)
  }
  catch (error) {
    console.error('Failed to parse S3 URL:', error)
    return
  }

  try {
    // Call backend to delete from S3 and database
    await adminProjectStore.deleteProjectImage({
      field,
      index,
      s3Key,
      projectId: (props.project as Record<string, any>)._id,
      key,
    })

    // Remove from frontend after successful backend deletion
    uploadedFiles.value.splice(index, 1)
    selectedFilesCount.value = uploadedFiles.value.length

    // Update filename display
    /* if (uploadedFiles.value.length === 0) {
      selectedFileName.value = ''
    }
    else if (uploadedFiles.value.length === 1 && uploadedFiles.value[0]) {
      selectedFileName.value = uploadedFiles.value[0].originalname || 'image'
    } */
  }
  catch (error) {
    console.error('Failed to delete image:', error)
    // Error notification is already handled in the store
  }
}

function emitProjectValue(e: Event | string, field: string) {
  const value = typeof e === 'string' ? e : (e as Event & { target: HTMLInputElement | HTMLSelectElement }).target?.value ?? e
  if (field === 'category') {
    const found = categories.value.find((c: Category) => c._id === value)
    return emit('projectValueUpdated', { value: found, field })
  }

  if (field === 'images') {
    return emit('projectValueUpdated', { value: Array.from((e as Event & { target: HTMLInputElement }).target?.files ?? []), field })
  }
  emit('projectValueUpdated', { value, field })
}

// Expose method to manually refresh images after save
defineExpose({
  refreshImages: loadExistingImages,
})
</script>

<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <h2 class="card-header-title">
        Project Landing Page
      </h2>
    </header>
    <div class="card-content card-section">
      <form>
        <div class="field">
          <label class="label" for="ProjectTitle">Project title</label>
          <div class="control">
            <input
              id="ProjectTitle"
              :value="project.title"
              class="input"
              type="text"
              placeholder="Amazing Project Title"
              @input="emitProjectValue($event, 'title')"
              @blur="titleTouched = true"
            >
            <div v-if="titleTouched && !titleValid" class="form-error">
              <span class="help is-danger">Title should be minimum 10 characters</span>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label" for="ProjectSubtitle">Project subtitle</label>
          <div class="control">
            <input
              id="ProjectSubtitle"
              :value="project.subtitle !== 'undefined' ? project.subtitle : ''"
              class="input"
              type="text"
              placeholder="Awesome Project Subtitle"
              @input="emitProjectValue($event, 'subtitle')"
            >
          </div>
        </div>

        <div class="field">
          <label class="label">Project description</label>
          <div class="control">
            <EditorProjectEditor
              :initial-content="project.description || ''"
              @editor-updated="(content: string) => emitProjectValue(content, 'description')"
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="projectCategory">Category</label>
          <div class="select">
            <select id="projectCategory" :value="project.category._id" @change="emitProjectValue($event, 'category')">
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="field">
          <label class="label">Project Image</label>
          <div class="">
            <div class=" centered p-0">
              <!-- Show file input only when there are images -->
              <div v-if="uploadedFiles.length > 0 || image.length > 0" class="file has-name is-fullwidth">
                <input
                  id="productPhoto"
                  ref="imagesInput"
                  class="file-input"
                  type="file"
                  multiple
                  title=" "
                  @change="imagesAdd"
                  @input="emitProjectValue($event, 'images')"
                >
                <label for="productPhoto" class="file-label">
                  <span class="file-cta">
                    <span class="file-label">{{ formatNames(selectedFilesCount) }}</span>
                  </span>
                </label>
              </div>

              <!-- Show upload button when no images exist -->
              <div v-else class="control">
                <button type="button" class="button is-primary is-light" @click="imagesInput?.click()">
                  <span class="icon">
                    <Icon name="mdi:upload" />
                  </span>
                  <span>Upload Images</span>
                </button>
                <input
                  id="productPhoto"
                  ref="imagesInput"
                  class="file-input"
                  type="file"
                  multiple
                  style="display: none"
                  @change="imagesAdd"
                  @input="emitProjectValue($event, 'images')"
                >
              </div>

              <div v-if="uploadedFiles.length !== 0" class="notification is-danger is-light my-2" role="alert">
                Note: Uploading new images will replace the existing images
              </div>

              <figure
                v-if="uploadedFiles.length !== 0 && image.length === 0"
                class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2"
              >
                <div
                  v-for="(img, index) in uploadedFiles"
                  :key="index"
                  class="img-wrap p-2"
                  tabindex="0"
                >
                  <img :src="img.location" class="img-thumbnail multiple-images" :alt="(img.originalname?.split('.').at(0)) ?? img.originalname">
                  <button
                    type="button"
                    class="delete-img-btn"
                    aria-label="Remove image"
                    @click="removeS3Image(index, 'images')"
                  >
                    <i class="fas fa-times-circle" aria-hidden="true" />
                  </button>
                </div>
              </figure>

              <div v-else class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                <div v-for="(prodImage, index) in image" :key="index" class="img-wrap p-2" tabindex="0">
                  <img :src="prodImage" class="img-thumbnail" :alt="`uploaded-file-${index + 1}`">
                  <button
                    type="button"
                    class="delete-img-btn"
                    aria-label="Remove image"
                    @click="removeImage(index)"
                  >
                    <i class="fas fa-times-circle" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label" for="ProjectLink">Project Link</label>
          <div class="control">
            <input
              id="ProjectLink"
              :value="project.productLink !== 'undefined' ? project.productLink : ''"
              class="input"
              type="text"
              placeholder="https://kathirr007-portfolio.herokuapp.com/"
              @input="emitProjectValue($event, 'productLink')"
            >
          </div>
        </div>

        <div class="field">
          <label class="label" for="ProjectRepositoryLink">Project Repository Link</label>
          <div class="control">
            <input
              id="ProjectRepositoryLink"
              :value="project.promoVideoLink !== 'undefined' ? project.promoVideoLink : ''"
              class="input"
              type="text"
              placeholder="https://kathirr007-portfolio.herokuapp.com/"
              @input="emitProjectValue($event, 'promoVideoLink')"
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.uploaded-files {
  .img-wrap {
    position: relative;
    width: 25%;

    .img-thumbnail {
      padding: 1rem;
      background-color: #fff;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      max-width: 100%;
      height: auto;
    }

    .delete-img-btn {
      opacity: 0;
      position: absolute;
      right: 5px;
      top: 0;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      transition: opacity 0.2s ease-in;

      i.fas {
        font-size: 18px !important;
        color: orangered !important;
      }

      &:hover {
        opacity: 1;
      }

      &:focus {
        outline: 2px solid #00d1b2;
        outline-offset: 2px;
        opacity: 1;
      }
    }

    &:hover .delete-img-btn {
      opacity: 1;
    }
  }
}
</style>
