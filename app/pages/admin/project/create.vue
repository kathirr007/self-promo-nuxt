<script setup lang="ts">
import AdminProjectCreateStep1 from '~/components/admin/ProjectCreateStep1.vue'
import AdminProjectCreateStep2 from '~/components/admin/ProjectCreateStep2.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const router = useRouter()
const adminProjectStore = useAdminProjectStore()
const categoryStore = useCategoryStore()

// Initialize categories on page load (SSR + CSR)
if (import.meta.server || !categoryStore.hasCategories) {
  await categoryStore.fetchCategories()
}

const activeStep = ref(1)
const steps = [AdminProjectCreateStep1, AdminProjectCreateStep2]
const stepsLength = steps.length
const canProceed = ref(false)
const isCreating = ref(false)
const form = reactive({ title: '', category: '' })

const isFirstStep = computed(() => activeStep.value === 1)
const isLastStep = computed(() => activeStep.value === stepsLength)
const progress = computed(() => `${(activeStep.value / stepsLength) * 100}%`)
const activeComponent = computed(() => steps[activeStep.value - 1])

function mergeFormData({ data, isValid }: { data: Record<string, any>, isValid: boolean }) {
  Object.assign(form, data)
  canProceed.value = isValid
}

function nextStep() {
  if (activeStep.value < stepsLength)
    activeStep.value++
}

function previousStep() {
  if (activeStep.value > 1)
    activeStep.value--
}

function _nextStep() {
  nextStep()
  canProceed.value = false
}

function _previousStep() {
  previousStep()
  canProceed.value = true
}

async function createProject() {
  isCreating.value = true
  try {
    await adminProjectStore.createProject(form)
  }
  finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div class="full-page-takeover-window">
    <div class="full-page-takeover-page">
      <SharedHeader :title="`Step ${activeStep} of ${stepsLength}`" exit-link="/admin/projects" />
      <div class="full-page-takeover-header-bottom-progress">
        <div :style="{ width: progress }" class="full-page-takeover-header-bottom-progress-highlight" />
      </div>
      <div class="project-create full-page-takeover-container">
        <div class="container">
          <KeepAlive>
            <component
              :is="activeComponent"
              @step-updated="mergeFormData"
              @go-next="_nextStep"
            />
          </KeepAlive>
        </div>
        <div class="full-page-footer-row">
          <div class="container">
            <div class="full-page-footer-col">
              <div v-if="!isFirstStep">
                <a class="button" @click.prevent="_previousStep" @keyup.enter="_previousStep">Previous</a>
              </div>
              <div v-else class="empty-container" />
            </div>
            <div class="full-page-footer-col">
              <button v-if="!isLastStep" :disabled="!canProceed" class="button float-right" @click.prevent="_nextStep" @keyup.enter="_nextStep">
                Continue
              </button>
              <button 
                v-else 
                :disabled="!canProceed || isCreating" 
                class="button is-success float-right" 
                :class="{ 'is-loading': isCreating }"
                @click="createProject" 
                @keyup.enter="createProject"
              >
                {{ isCreating ? 'Creating...' : 'Confirm' }}
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
    font-weight: 500;
    line-height: 1.1;
    margin-top: 21px;
    margin-bottom: 10.5px;
    font-size: 36px;
    font-weight: 300;
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
    &-field {
      min-width: 552px;
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
