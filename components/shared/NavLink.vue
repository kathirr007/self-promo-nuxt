<template>
  <nuxt-link
    :to="to"
    :class="{'is-active': isActive}"
  >
    <slot />
  </nuxt-link>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props:{
      to: {
        type: String,
        required: true
      }
    },
    computed: {
      isActive() {
        return this.to === this.$route.path
      }
    }
  }
</script>

<style lang="scss" scoped>
.is-active {
  border-bottom: 4px solid #32a0ff;
  font-weight: bold;
}
</style>