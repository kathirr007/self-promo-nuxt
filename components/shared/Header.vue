<template>
  <div class="full-page-takeover-header">
    <div class="full-page-takeover-header-logo">
      <nuxt-link to="/admin" class="has-text-white" aria-label="Admin home">
        <!-- <p class="full-page-takeover-header-logo-title">Self Promo</p> -->
        <h1 class="full-page-takeover-header-logo-title"> <button class="button is-primary is-outlined is-medium is-inverted"> <span class="icon"> <span class="sr-only is-hidden">Admin home</span> <i class="fas fa-home"></i> </span> <!-- <span>Self Promo</span> --> </button> </h1>
      </nuxt-link>
    </div>
    <div class="full-page-takeover-header-divider"></div>
    <header class="full-page-takeover-header-text">
      <h1 class="title is-3 is-line-height-normal has-text-white"> {{ title }} </h1>
    </header>
    <div class="user-box">
      <figure class="image is-48x48 m-r-sm"> <img class="is-rounded" :src="user.avatar" alt="User avatar" height="48" width="48" /> </figure>
      <div class="m-r-sm">Welcome {{ user.username }}!</div>
    </div>
    <slot name="actionMenu"></slot>
    <div v-if="exitLink" class="full-page-takeover-header-button">
      <a v-if="user" class="button is-danger is-inverted is-outlined mr-4" @click.prevent="logout">Logout</a>
      <nuxt-link :to="exitLink" class="button is-primary is-inverted is-outlined"> Exit </nuxt-link>
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
  },
  methods: {
    logout() {
      this.$store
        .dispatch("authentication/logout", this.form)
        .then(() => {
          // this.$router.push('/')
          this.isActive = !this.isActive;
          this.$router.push("/login");
          this.$toasted.success("Successfully logged out...", {
            duration: 3000
          });
        })
        .catch(err =>
          this.$toasted.error("There is something wrong.. :(", {
            duration: 3000
          })
        );
    },
    googleLogout() {
      this.isActive = !this.isActive;
      this.$auth.logout("google");
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
