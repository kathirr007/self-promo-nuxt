<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <p class="card-header-title">Technologies used in this Project</p>
    </header>
    <div class="card-content card-section">
      <form @submit.stop.prevent>
        <multi-line-text-input
          :lines="project.wsl"
          :addBtn="'Add Technology'"
          @valueUpdated="updateLine($event, 'wsl')"
          @addClicked="addLine('wsl')"
          @removeClicked="removeLine($event, 'wsl')"
          label="What Technologies used?"
          ref="multiInput"
        />
        <!-- <multi-line-text-input
          :lines="project.requirements"
          @valueUpdated="updateLine($event, 'requirements')"
          @addClicked="addLine('requirements')"
          @removeClicked="removeLine($event, 'requirements')"
          label="What are the requirements"
        /> -->
      </form>
    </div>
  </div>
</template>

<script>
import MultiLineTextInput from "~/components/form/MultiLineTextInput";
export default {
  components: {
    MultiLineTextInput
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  methods: {
    addLine(field) {
      // debugger;
      console.log("Adding line for: ", field);
      this.$store.commit("admin/project/addLine", field);
      this.$nextTick(() =>
        this.$refs.multiInput.$refs[
          `multiInput${this.project.wsl.length - 1}`
        ][0].focus()
      );
    },
    removeLine(index, field) {
      console.log("Removing line from: ", field);
      console.log("Removing line of index: ", index);
      this.$store.commit("admin/project/removeLine", { field, index });
    },
    updateLine({ value, index }, field) {
      this.$store.dispatch("admin/project/updateLine", {
        field,
        value,
        index
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
