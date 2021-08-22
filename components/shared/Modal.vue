<template>
  <div>
    <div @click="openModal" v-if="showButton">
      <slot name="submitBtn">
        <button :class="openBtnClass">{{ openTitle }}</button>
      </slot>
    </div>
    <!-- <transition name="slideUp" mode="out-in"> -->
    <div class="modal animated" :class="[isOpen ? 'is-active' : 'slideOutUp']">
      <div class="modal-background"></div>
      <div class="modal-card animated" :class="[isOpen ? 'slideInDown' : '']">
        <header class="modal-card-head">
          <h2 class="modal-card-title">{{ title }}</h2>
          <button
            @click="isOpen = false"
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="content">
            <slot></slot>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            :disabled="isDisabled"
            @click="emitAction"
            class="button is-success"
          >
            {{ actionTitle }}
          </button>
          <button
            v-if="removeActionTitle"
            @click="emitDeleteAction"
            class="button is-danger"
          >
            {{ removeActionTitle }}
          </button>
          <button @click="isOpen = false" class="button">Cancel</button>
        </footer>
      </div>
    </div>
    <!-- </transition> -->
  </div>
</template>
<script>
export default {
  props: {
    openTitle: {
      type: String,
      default: "Open"
    },
    title: {
      type: String,
      default: "Hey There"
    },
    actionTitle: {
      type: String,
      default: "Commit"
    },
    removeActionTitle: {
      type: String
    },
    openBtnClass: {
      type: String,
      default: "button"
    },
    showButton: {
      type: Boolean,
      default: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      modalAnimationClass: "slideInDown"
    };
  },

  methods: {
    emitAction() {
      this.$emit("submitted", {
        closeModal: this.closeCallback
      });
    },
    emitDeleteAction() {
      this.$emit("deleted", {
        closeModal: this.closeCallback
      });
    },
    closeCallback() {
      this.isOpen = false;
    },
    openModal() {
      this.isOpen = true;
      this.$emit("opened");
    }
  }
};
</script>
<style scoped lang="scss">
.modal-card-body {
  color: black;
}

@-webkit-keyframes slideOutUp {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}

@keyframes slideOutUp {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}

.modal {
  z-index: 9999;
  display: block;
  &.is-active {
    display: flex;
  }
}
</style>
