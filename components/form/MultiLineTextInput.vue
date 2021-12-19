<template>
  <div>
    <!-- Send a label through props -->
    <label class="label">{{ label }}</label>
    <!-- Iterate lines here -->
    <div v-for="(line, index) in lines" :key="index" class="multi-field field">
      <div class="control multi-control">
        <div class="multi-input-container">
          <label :for="`multi-input${index + 1}`" class="sr-only">
            {{ `Multi Input ${index + 1}` }}
          </label>
          <input
            :id="`multi-input${index + 1}`"
            @input="emitUpdate($event, index)"
            :value="line.value"
            class="input multi-input"
            type="text"
            :placeholder="'Add Something Nice (:'"
            @keyup.enter.prevent="emitAdd()"
            :ref="`multiInput${index}`"
          />
        </div>
        <div class="btn-container">
          <!-- Delete the line -->
          <button
            @click.prevent="emitRemove(index)"
            type="button"
            class="button m-l-sm is-danger multi-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <!-- Add the Line -->
    <button
      @click="emitAdd()"
      type="button"
      class="m-b-sm button is-link is-outlined"
    >
      {{ addBtn }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    lines: {
      type: Array,
      required: true
    },
    addBtn: {
      type: String,
      default: "Add"
    }
  },
  computed: {
    lastLine() {
      return this.lines[this.lines.length - 1];
    },
    hasLines() {
      return this.lines.length > 0;
    },
    hasLastLineVale() {
      return this.lastLine && this.lastLine.value !== "";
    },
    canDeleteLine() {
      return this.lines.length > 1;
    },
    canAddLine() {
      return this.hasLines && this.hasLastLineVale;
    }
  },
  methods: {
    emitAdd() {
      // debugger;
      console.log("emit Add..");
      if (this.canAddLine || this.lines.length === 0) {
        this.$emit("addClicked");
      }
    },
    emitRemove(index) {
      this.canDeleteLine && this.$emit("removeClicked", index);
    },
    emitUpdate(event, index) {
      const { value } = event.target;
      this.$emit("valueUpdated", { value, index });
    }
  }
};
</script>

<style scoped lang="scss">
.multi-input {
  float: left;
  width: 100%;
}

.multi-button {
  height: inherit;
}

.multi-input-container {
  display: flex;
  flex: 1;
}

.btn-container {
  display: flex;
  opacity: 0;
}

.multi-control {
  display: flex;

  &:hover > .btn-container {
    opacity: 1;
  }
}
</style>
