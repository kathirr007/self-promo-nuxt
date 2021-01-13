<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <p class="card-header-title">Pricing</p>
    </header>
    <div class="card-content card-section">
      <div class="field">
        <label class="label">Price of the project</label>
        <div class="control">
          <input
            :value="project.price"
            @input="($event) => emitCourseValue($event, 'price')"
            class="input"
            type="text"
            placeholder="179.99"
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Discounted Price for the project</label>
        <div class="control">
          <input
            :value="project.discountedPrice"
            @input="($event) => emitCourseValue($event, 'discountedPrice')"
            class="input"
            type="text"
            placeholder="9.99"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  methods: {
    emitCourseValue(e, field) {
      this.$emit("projectValueUpdated", { value: e.target.value, field });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>