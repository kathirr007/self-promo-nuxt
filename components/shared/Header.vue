<template>
  <div class="full-page-takeover-header">
    <div class="full-page-takeover-header-logo">
      <nuxt-link to="/admin" class="has-text-white">
        <!-- <p class="full-page-takeover-header-logo-title">Self Promo</p> -->
        <p class="full-page-takeover-header-logo-title">
          <button class="button is-primary is-outlined is-medium is-inverted">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <!-- <span>Self Promo</span> -->
          </button>
        </p>
      </nuxt-link>
    </div>

    <div class="full-page-takeover-header-divider"></div>

    <div class="full-page-takeover-header-text">
      {{ title }}
    </div>
    <div class="user-box">
      <figure class="image is-48x48 m-r-sm">
        <img
          class="is-rounded"
          :src="user.avatar"
          alt="User avatar"
          height="48"
          width="48"
        />
      </figure>
      <div class="m-r-sm">Welcome {{ user.username }}!</div>
    </div>
    <slot name="actionMenu"></slot>
    <div v-if="exitLink" class="full-page-takeover-header-button">
      <nuxt-link
        :to="exitLink"
        class="button is-danger is-inverted is-outlined"
      >
        Exit
      </nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    exitLink: {
      required: false,
      type: String,
      default: null
    }
  },
  computed: {
    user() {
      return this.$store.getters["authentication/authUser"] || {};
    }
  }
};
</script>
<style scoped lang="scss">
.user-box {
  align-items: center;
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: flex-start;
  margin-right: 10px;
  font-size: 17px;
  font-weight: bold;
  @media screen and (max-width: 650px) {
    font-size: 12px;
    .image {
      height: auto;
    }
  }
}
</style>
