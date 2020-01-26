<template>
  <div>
    <input
      :maxLength="maxLength"
      @blur="v.$touch()"
      type="text"
      @input="emitInputValue"
      placeholder="e.g. Amazing Course in Flutter!"
      class="input is-large"
    >
    <span class="icon is-small is-right">
      {{maxLength - inputLength}}
    </span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentValue: ''
      }
    },
    props: {
      maxLength: {
        type: Number,
        default: 50,
        required: false
      },
      v: {
        type: Object,
        required: true
      }
    },
    computed: {
      inputLength() {
        return this.currentValue.length || 0
      },
      remainingLength() {
        if(this.inputLength > 0 && this.inputLength < this.maxLength) {
          return this.maxLength - this.inputLength
        } else if(this.inputLength === 0) {
          return this.maxLength
        } else {
          return 0
        }
        return this.currentValue.length || 0
      }
    },
    methods: {
      emitInputValue($event) {
        this.currentValue = $event.target.value
        this.$emit('input', $event.target.value)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>