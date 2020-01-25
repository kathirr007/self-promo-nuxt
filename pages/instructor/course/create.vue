<template>
  <div class="full-page-takeover-window">
    <div class="full-page-takeover-page">
      <Header :title="`Step 1 of 2`" exitLink="/instructor/courses" />
      <div class="full-page-takeover-header-bottom-progress">
        <div :style="{width: progress}" class="full-page-takeover-header-bottom-progress-highlight">
        </div>
      </div>
      <div class="course-create full-page-takeover-container">
        <div class="container">
          <keep-alive>
            <component
              :is="activeComponent"
              ref="activeComponent"
              @stepUpdated="mergeFormData"
            />
          </keep-alive>
          <!-- STEP 1 of FORM  -->
          <!-- <course-create-step1 v-if="activeStep === 1"></course-create-step1> -->
          <!-- STEP 1 END-->
          <!-- STEP 2 of FORM -->
          <!-- <course-create-step2 v-if="activeStep === 2"></course-create-step2> -->
          <!-- STEP 2 END -->
        </div>
        <div class="full-page-footer-row">
          <div class="container">
            <div class="full-page-footer-col">
              <div v-if="!isFirstStep">
                <a @click.prevent="previousStep" class="button">Previous</a>
              </div>
              <div v-else class="empty-container">
              </div>
            </div>
            <div class="full-page-footer-col">
              <div>
                <button
                  :disabled="!canProceed"
                  v-if="!isLastStep"
                  @click.prevent="nextStep"
                  class="button float-right"
                >
                  Continue
                </button>
                <button v-else
                  :disabled="!canProceed"
                  @click="() => {}"
                  class="button is-success float-right">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '~/components/shared/header'
  import courseCreateStep1 from '~/components/instructor/courseCreateStep1'
  import courseCreateStep2 from '~/components/instructor/courseCreateStep2'
  export default {
    layout: 'instructor',
    components: {
      Header,
      courseCreateStep1,
      courseCreateStep2
    },
    data() {
      return {
        activeStep: 1,
        steps: ['courseCreateStep1', 'courseCreateStep2'],
        canProceed: false,
        form: {
          title: '',
          category: ''
        }
      }
    },
    computed: {
      stepsLength() {
        return this.steps.length
      },
      isFirstStep() {
        return this.activeStep === 1
      },
      isLastStep() {
        return this.activeStep === this.stepsLength
      },
      progress() {
        return `${100 / this.stepsLength * this.activeStep}%`
      },
      activeComponent() {
        return this.steps[this.activeStep - 1]
      },
      categories() {
        return this.$store.state.category.items
      }
    },
    fetch({store}) {
      return store.dispatch('category/fetchCategories')
    },
    methods: {
      nextStep() {
        this.activeStep++
        this.$nextTick(() => this.canProceed = this.$refs.activeComponent.isValid)
      },
      previousStep() {
        this.activeStep--
        this.canProceed = true
      },
      /* mergeFormData(stepData) {
        this.form = {...this.form, ...stepData.data}
        this.canProceed = stepData.isValid
      } */
      mergeFormData({data, isValid}) {
        this.form = {...this.form, ...data}
        this.canProceed = isValid
      }
    }
  }
</script>

<style lang="scss">
  .float-right {
    float: right;
  }

  .empty-container {
    width: 1px;
    height: 1px;
  }

  .course-create {
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

        >select {
          width: 100%;
        }
      }
    }
  }
</style>