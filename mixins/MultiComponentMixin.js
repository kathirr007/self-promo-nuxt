export default {
  data() {
    return {
      activeStep: 1,
      steps: []
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
  methods: {
    nextStep() {
      this.activeStep++
    },
    previousStep() {
      this.activeStep--
    },
    navigateTo(step) {
      this.activeStep = step
    },
    activeComponentClass(step) {
      return this.activeStep === step ? 'is-active' : ''
    }
  }
}