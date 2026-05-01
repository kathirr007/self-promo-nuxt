<script setup lang="ts">
import type { ProjectCardProps } from '~/types'
import { computed, onBeforeUnmount, ref, shallowReactive } from 'vue'
import { Fade, FluxControls, FluxPagination, Img, Slide, VueFlux } from 'vue-flux'

const props = defineProps<ProjectCardProps>()
const cardRef = ref<HTMLElement | null>(null)
const previewRef = ref<HTMLElement | null>(null)
const previewVisible = ref(false)
const previewPlacement = ref<'left' | 'right'>('right')
let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

function shortenText(text: string, max: number): string {
  return text && text.length > max ? `${text.slice(0, max)}...` : text
}

function stripHtml(text?: string): string {
  if (!text)
    return ''

  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const projectDescription = computed(() => shortenText(stripHtml(props.project.description), 150))
const projectSubtitle = computed(() => shortenText(props.project.subtitle ?? '', 60))
const projectWsl = computed(() => props.project.wsl?.slice(0, 6) ?? [])

const vfOptions = shallowReactive({
  autoplay: true,
  delay: 1500,
})

const vfRscs = computed(() =>
  (props.project.images || [])
    .filter(img => !!img.location)
    .map((img, index) => new Img(img.location, `${props.project.title} image ${index + 1}`)),
)

const vfTransitions = shallowReactive([Fade, Slide])

function clearTimers() {
  if (openTimer) {
    clearTimeout(openTimer)
    openTimer = null
  }

  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function updatePlacement() {
  if (!cardRef.value || typeof window === 'undefined')
    return

  const rect = cardRef.value.getBoundingClientRect()
  const previewWidth = 360
  const gap = 18
  const roomOnRight = window.innerWidth - rect.right
  const roomOnLeft = rect.left

  if (roomOnRight >= previewWidth + gap) {
    previewPlacement.value = 'right'
    return
  }

  if (roomOnLeft >= previewWidth + gap) {
    previewPlacement.value = 'left'
    return
  }

  previewPlacement.value = roomOnRight >= roomOnLeft ? 'right' : 'left'
}

function showPreview() {
  if (typeof window !== 'undefined' && window.innerWidth < 1024)
    return

  clearTimers()
  updatePlacement()
  openTimer = setTimeout(() => {
    previewVisible.value = true
  }, 120)
}

function hidePreview() {
  clearTimers()
  closeTimer = setTimeout(() => {
    previewVisible.value = false
  }, 80)
}

function handleFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget as Node | null

  if (
    nextTarget
    && (cardRef.value?.contains(nextTarget) || previewRef.value?.contains(nextTarget))
  ) {
    return
  }

  hidePreview()
}

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <div
    ref="cardRef"
    class="project-card-shell"
    @mouseenter="showPreview"
    @mouseleave="hidePreview"
    @focusin="showPreview"
    @focusout="handleFocusOut"
  >
    <div class="card project-card">
      <div class="card-image">
        <ClientOnly v-if="vfRscs.length > 1">
          <VueFlux
            :options="vfOptions"
            :rscs="vfRscs"
            :transitions="vfTransitions"
            class="flux-slider"
          >
            <template #controls="controlsProps">
              <FluxControls v-bind="controlsProps" />
            </template>
            <template #pagination="paginationProps">
              <FluxPagination v-bind="paginationProps" />
            </template>
          </VueFlux>
        </ClientOnly>
        <img
          v-else-if="vfRscs.length === 1"
          :src="project.images[0]?.location || project.image"
          alt="Project Image"
        >
        <img
          v-else
          src="https://dummyimage.com/265x145/9e9e9e/ffffff&text=Kathirr007+Portfolio"
          alt="Placeholder image"
        >
      </div>
      <div class="card-content">
        <div class="content">
          <h2 class="title is-4">
            {{ shortenText(project.title, 45) }}
          </h2>
        </div>
        <div class="content project-subtitle">
          {{ shortenText(project.subtitle as string, 45) }}
          <br>
        </div>
      </div>
      <footer class="card-footer">
        <NuxtLink
          :to="`/projects/${project.slug}`"
          :aria-label="project.title"
          class="card-footer-item"
        >
          View project details
        </NuxtLink>
      </footer>
    </div>

    <Transition name="preview-fade">
      <div
        v-if="previewVisible"
        ref="previewRef"
        class="project-card-preview"
        :class="`is-${previewPlacement}`"
        @mouseenter="showPreview"
        @mouseleave="hidePreview"
        @focusin="showPreview"
        @focusout="handleFocusOut"
      >
        <span class="project-card-preview__arrow" />
        <ProjectCardTooltip
          :title="project.title"
          :subtitle="projectSubtitle"
          :description="projectDescription"
          :wsl="projectWsl"
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.project-card-shell {
  position: relative;
  display: flex;
  width: 100%;
}

.card-image {
  height: 175px;
  overflow: hidden;
  position: relative;
  padding: 10px;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: top;
  }

  &:hover {
    opacity: 0.9;
  }

  @media screen and (min-width: 768px) {
    height: 150px;
    padding: 0;
    img {
      object-fit: cover;
      object-position: top;
    }
  }
}

.project-card {
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;
  border-radius: 0.9rem;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;

  &:hover,
  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
  }

  .card-content {
    display: flex;
    flex-flow: column;
    flex: 1;

    .content {
      display: flex;
      flex: 1;
    }
  }
}

.project-subtitle {
  color: #4b5563;
  line-height: 1.6;
}

.project-card-preview {
  position: absolute;
  top: 50%;
  z-index: 100;
  pointer-events: auto;
  transform: translateY(-50%);
}

.project-card-preview.is-right {
  left: calc(100% + 1rem);
}

.project-card-preview.is-left {
  right: calc(100% + 1rem);
}

.project-card-preview__arrow {
  position: absolute;
  top: 50%;
  width: 1rem;
  height: 1rem;
  background: #fff;
  border-top: 1px solid rgba(15, 23, 42, 0.12);
  border-left: 1px solid rgba(15, 23, 42, 0.12);
  transform: translateY(-50%) rotate(-45deg);
}

.project-card-preview.is-right .project-card-preview__arrow {
  left: -0.48rem;
}

.project-card-preview.is-left .project-card-preview__arrow {
  right: -0.48rem;
  transform: translateY(-50%) rotate(135deg);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}

.preview-fade-enter-from.project-card-preview.is-right,
.preview-fade-leave-to.project-card-preview.is-right {
  transform: translateY(-50%) translateX(-8px);
}

.preview-fade-enter-from.project-card-preview.is-left,
.preview-fade-leave-to.project-card-preview.is-left {
  transform: translateY(-50%) translateX(8px);
}

.image-strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.vue-flux.flux-slider) {
  height: 100% !important;
  width: 100% !important;
}

:deep(.vue-flux.flux-slider .flux-image) {
  background-size: cover !important;
  background-position: top center !important;
}

@media screen and (max-width: 1023px) {
  .project-card-preview {
    display: none;
  }
}
</style>
