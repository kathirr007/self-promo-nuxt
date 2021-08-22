<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <h2 class="card-header-title">Status</h2>
    </header>
    <div class="card-content card-section">
      <div class="field">
        <label class="label" for="projectStatus">Status</label>
        <div class="select">
          <select
            id="projectStatus"
            :value="project.status"
            @change="$event => emitProjectValue($event, 'status')"
          >
            <!-- <option value="default">Change Status</option> -->
            <option value="active">Active</option>
            <option value="published">Published</option>
          </select>
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
      required: true
    }
  },
  methods: {
    emitProjectValue(e, field) {
      this.$emit("projectValueUpdated", { value: e.target.value, field });
    }
  }
};
</script>

<style lang="scss" scoped></style>
