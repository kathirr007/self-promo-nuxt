<template>
  <div class="dropdown" :class="{ 'is-active': isActive }"  @keyup.esc="closeDropdown">
    <div class="dropdown-trigger">
      <div
        @click="isActive = !isActive"
        @keyup.enter="isActive = !isActive"
        @keyup.space="isActive = !isActive"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
        tabindex="0"
        role="link"
        aria-label="toggle-menu"
      >
        <span></span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </div>
    </div>
    <div class="dropdown-menu" id="dropdown-menu">
      <div class="dropdown-content"  role="menu">
        <a
          role="menuitem"
          tabindex="0"
          v-for="item in items"
          :key="item.name"
          @click.prevent="emitOption($event, item.command)"
          @keyup.enter="emitOption($event, item.command)"
          class="dropdown-item"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
    <div v-if="isActive" class="outside" @click="closeDropdown" @keyup.esc="closeDropdown"></div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isActive: false
      // items: ['Option 1', 'Option 2', 'Option 3']
    };
  },
  methods: {
    emitOption(e, command) {
      e.preventDefault();
      e.stopImmediatePropagation();
      // debugger
      this.$emit("optionChanged", command);
    },
    closeDropdown() {
      this.isActive = false;
    }
  }
};
</script>
<style scoped lang="scss">
.outside {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
}
.dropdown-trigger {
  &:hover {
    cursor: pointer;
  }
}

i {
  font-size: 25px;
  align-self: end;
}
</style>
