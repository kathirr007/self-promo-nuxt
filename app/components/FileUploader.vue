<script setup lang="ts">
import type { FileValidation, UploadedFile, UploadResponse } from '~/types/upload'

// Component props
interface Props {
  maxFiles?: number
  maxSize?: number
  allowedTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: () => ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'],
})

// Emits for parent component
const emit = defineEmits<{
  uploadComplete: [files: UploadedFile[]]
  uploadError: [error: string]
}>()
// Reactive state
const selectedFiles = ref<File[]>([])
const uploading = ref<boolean>(false)
const uploadProgress = ref<number>(0)
const uploadResults = ref<UploadedFile[]>([])
const errorMessage = ref<string>('')
const isDragOver = ref<boolean>(false)

// Template refs
const fileInput = ref<HTMLInputElement>()

// Configuration
const config: FileValidation = {
  maxSize: props.maxSize,
  maxFiles: props.maxFiles,
  allowedTypes: props.allowedTypes,
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
}

// Computed properties
const acceptedFileTypes = computed<string>(() => {
  return `${config.allowedTypes.map(type => `.${type}`).join(',')},${
    config.allowedMimeTypes.join(',')}`
})

// Event handlers
function handleFileSelect(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files)
    addFiles(files)
  }
}

function handleDrop(event: DragEvent): void {
  event.preventDefault()
  isDragOver.value = false

  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files)
    addFiles(files)
  }
}

function triggerFileInput(): void {
  fileInput.value?.click()
}

// File management functions
function addFiles(files: File[]): void {
  const validFiles: File[] = []

  for (const file of files) {
    // Check file size
    if (file.size > config.maxSize) {
      setError(`File "${file.name}" is too large. Maximum size is ${formatFileSize(config.maxSize)}.`)
      continue
    }

    // Check file type by extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !config.allowedTypes.includes(extension)) {
      setError(`File "${file.name}" has an unsupported format. Allowed: ${config.allowedTypes.join(', ')}`)
      continue
    }

    // Check MIME type
    if (!config.allowedMimeTypes.includes(file.type)) {
      setError(`File "${file.name}" has an unsupported MIME type.`)
      continue
    }

    // Check for duplicates
    const isDuplicate = selectedFiles.value.some(
      existingFile => existingFile.name === file.name && existingFile.size === file.size,
    )

    if (isDuplicate) {
      setError(`File "${file.name}" is already selected.`)
      continue
    }

    validFiles.push(file)
  }

  // Check total file count
  if (selectedFiles.value.length + validFiles.length > config.maxFiles) {
    setError(`Maximum ${config.maxFiles} files allowed at once.`)
    return
  }

  selectedFiles.value.push(...validFiles)
  clearError()

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removeFile(index: number): void {
  selectedFiles.value.splice(index, 1)
}

function clearFiles(): void {
  selectedFiles.value = []
  clearError()
}

function clearResults(): void {
  uploadResults.value = []
}

// Upload function optimized for Nitro
async function uploadFiles(): Promise<void> {
  if (selectedFiles.value.length === 0)
    return

  uploading.value = true
  uploadProgress.value = 0
  clearError()

  try {
    const formData = new FormData()

    // Append all files to FormData with the same field name 'files'
    selectedFiles.value.forEach((file) => {
      formData.append('files', file)
    })

    // Use $fetch with proper error handling for Nitro
    const response = await $fetch<UploadResponse>('/api/upload', {
      method: 'POST',
      body: formData,
      // Note: Nitro doesn't support onUploadProgress in the same way
      // We'll simulate progress for better UX
    })

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 10
      }
    }, 100)

    // Clear interval and set to 100% when done
    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.success) {
      uploadResults.value = response.files
      selectedFiles.value = []

      // Clear progress after a delay
      setTimeout(() => {
        uploadProgress.value = 0
      }, 2000)
    }
  }
  catch (error: any) {
    console.error('Upload failed:', error)

    // Handle Nitro error format
    const errorMessage = error?.data?.message || error?.message || 'Upload failed. Please try again.'
    setError(errorMessage)
  }
  finally {
    uploading.value = false
  }
}

// Utility functions
function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

function setError(message: string): void {
  errorMessage.value = message
}

function clearError(): void {
  errorMessage.value = ''
}

// Watch for upload completion
watch(uploadResults, (newResults) => {
  if (newResults.length > 0) {
    emit('uploadComplete', newResults)
  }
})

// Watch for errors
watch(errorMessage, (newError) => {
  if (newError) {
    emit('uploadError', newError)
  }
})
</script>

<template>
  <div class="upload-container">
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragenter.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        :accept="acceptedFileTypes"
        class="file-input"
        @change="handleFileSelect"
      >

      <div class="upload-prompt">
        <div class="upload-icon">
          📁
        </div>
        <p>
          Drag and drop files here or
          <button class="browse-btn" type="button" @click="triggerFileInput">
            browse
          </button>
        </p>
        <p class="upload-info">
          Maximum {{ config.maxFiles }} files, {{ formatFileSize(config.maxSize) }} each.
          Supported: {{ config.allowedTypes.join(', ').toUpperCase() }}
        </p>
      </div>
    </div>

    <!-- Selected Files Preview -->
    <div v-if="selectedFiles.length > 0" class="selected-files">
      <h3>Selected Files ({{ selectedFiles.length }})</h3>
      <div class="file-list">
        <div
          v-for="(file, index) in selectedFiles"
          :key="`${file.name}-${file.size}-${index}`"
          class="file-item"
        >
          <div class="file-info">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
            <span class="file-type">{{ file.type }}</span>
          </div>
          <button
            class="remove-btn"
            type="button"
            :disabled="uploading"
            @click="removeFile(index)"
          >
            ×
          </button>
        </div>
      </div>

      <div class="upload-actions">
        <button
          :disabled="uploading || selectedFiles.length === 0"
          class="upload-btn"
          type="button"
          @click="uploadFiles"
        >
          {{ uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)` }}
        </button>
        <button
          :disabled="uploading"
          class="clear-btn"
          type="button"
          @click="clearFiles"
        >
          Clear All
        </button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
      <p>{{ uploadProgress }}% Complete</p>
    </div>

    <!-- Upload Results -->
    <div v-if="uploadResults.length > 0" class="upload-results">
      <h3>Upload Results</h3>
      <div class="results-list">
        <div
          v-for="result in uploadResults"
          :key="result.fileName"
          class="result-item"
        >
          <div class="result-info">
            <span class="result-name">{{ result.originalName }}</span>
            <a
              :href="result.fileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="view-link"
            >
              View File
            </a>
          </div>
          <span class="result-size">{{ formatFileSize(result.fileSize) }}</span>
        </div>
      </div>
      <button class="clear-results-btn" type="button" @click="clearResults">
        Clear Results
      </button>
    </div>

    <!-- Error Messages -->
    <div v-if="errorMessage" class="error-message">
      <strong>Error:</strong> {{ errorMessage }}
      <button class="close-error" type="button" @click="clearError">
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Same styles as before - they remain unchanged */
.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.file-input {
  display: none;
}

.upload-prompt {
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.browse-btn {
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
}

.browse-btn:hover {
  color: #0056b3;
}

.upload-info {
  font-size: 14px;
  margin-top: 8px;
}

.selected-files {
  margin-top: 20px;
}

.file-list {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
}

.file-name {
  font-weight: 500;
  word-break: break-all;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.file-type {
  font-size: 11px;
  color: #999;
}

.remove-btn {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.remove-btn:hover:not(:disabled) {
  background: #cc0000;
}

.remove-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.upload-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.upload-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  font-weight: 500;
}

.upload-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.upload-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover:not(:disabled) {
  background-color: #545b62;
}

.upload-progress {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #28a745;
  transition: width 0.3s ease;
}

.upload-results {
  margin-top: 20px;
}

.results-list {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.result-item:last-child {
  border-bottom: none;
}

.result-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
}

.result-name {
  font-weight: 500;
}

.view-link {
  color: #007bff;
  text-decoration: none;
  font-size: 12px;
}

.view-link:hover {
  text-decoration: underline;
}

.result-size {
  font-size: 12px;
  color: #666;
}

.clear-results-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.clear-results-btn:hover {
  background-color: #545b62;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-error {
  background: none;
  border: none;
  color: #721c24;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
}

.close-error:hover {
  color: #000;
}
</style>
