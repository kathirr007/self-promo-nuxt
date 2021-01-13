<template>
  <div class="full-page-takeover-window">
    <div class="full-page-takeover-page">
      <Header
        :title="`Step ${activeStep} of ${stepsLength}`"
        exitLink="/admin/categories"
      />
      <div class="full-page-takeover-header-bottom-progress">
        <div
          :style="{ width: progress }"
          class="full-page-takeover-header-bottom-progress-highlight"
        ></div>
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
                <a @click.prevent="_previousStep" class="button">Previous</a>
              </div>
              <div v-else class="empty-container"></div>
            </div>
            <div class="full-page-footer-col">
              <div>
                <!-- <button
                  :disabled="!canProceed"
                  v-if="!isLastStep"
                  @click.prevent="_nextStep"
                  class="button float-right"
                >
                  Continue
                </button> -->
                <button
                  :disabled="!canProceed"
                  @click="createCategory"
                  class="button is-success float-right"
                >
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
import Header from "~/components/shared/Header";
import courseCreateStep1 from "~/components/admin/courseCreateStep1";
// import courseCreateStep2 from '~/components/admin/courseCreateStep2'
import MultiComponentMixin from "~/mixins/MultiComponentMixin";
export default {
  layout: "admin",
  components: {
    Header,
    courseCreateStep1,
    // courseCreateStep2
  },
  mixins: [MultiComponentMixin],
  data() {
    return {
      steps: ["courseCreateStep1"],
      canProceed: false,
      form: {
        title: "",
        // category: ''
      },
    };
  },
  computed: {},
  // fetch({store}) {
  //   return store.dispatch('category/fetchCategories')
  // },
  methods: {
    /* mergeFormData(stepData) {
        this.form = {...this.form, ...stepData.data}
        this.canProceed = stepData.isValid
      } */
    mergeFormData({ data, isValid }) {
      // debugger
      this.form = { ...this.form, ...data };
      this.canProceed = isValid;
    },
    createCategory() {
      // console.log(this.form)
      // debugger
      this.$store
        .dispatch("admin/category/createCategory", {
          name: this.form.title,
        })
        .then((_) =>
          this.$toasted.success(
            `The category <strong style="margin: 0 10px; display: inline-block;"> ${this.form.title} </strong> has been created successfully..`,
            { duration: 3500 }
          )
        );
    },
  },
};
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
      // min-width: 552px;
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