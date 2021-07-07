<template>
  <div class="pos-rel">
    <template v-if="$route.params.id">
      <input
        :maxLength="maxLength"
        @blur="v.$touch()"
        type="text"
        @input="emitInputValue"
        v-model="category.name"
        placeholder="e.g. Amazing Project in Flutter!"
        class="input is-large"
      />
      <span class="icon is-small is-right">
        {{ maxLength - inputLength }}
      </span>
    </template>
    <!-- <template v-else-if="$route.path.includes('category')">No worries, you can change name later.</template> -->
    <template v-else>
      <input
        :maxLength="maxLength"
        @blur="v.$touch()"
        type="text"
        @input="emitInputValue"
        @keydown.enter.prevent="_NextStep"
        placeholder="e.g. Amazing Project using Nuxt.js!"
        class="input is-large"
      />
      <span class="icon is-small is-right">
        {{ maxLength - inputLength }}
      </span>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentValue: ""
    };
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
    },
    category: {
      type: Object
    }
  },
  computed: {
    inputLength() {
      return this.currentValue.length || 0;
    },
    remainingLength() {
      if (this.inputLength > 0 && this.inputLength < this.maxLength) {
        return this.maxLength - this.inputLength;
      } else if (this.inputLength === 0) {
        return this.maxLength;
      } else {
        return 0;
      }
      return this.currentValue.length || 0;
    }
  },
  methods: {
    emitInputValue($event) {
      this.currentValue = $event.target.value;
      this.$emit("input", $event.target.value);
    },
    _NextStep() {
      if (this.v.$invalid) {
        return;
      }
      this.$emit("goNext");
    }
  }
};
</script>

<style lang="scss" scoped>
.pos-rel {
  position: relative;
  margin: 0 auto;
  width: 100%;
}
</style>
