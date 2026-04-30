<script setup>
defineProps({
  title: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
  navigateToPage: {
    required: true,
    type: String,
  },
  navigateToText: {
    required: true,
    type: String,
  },
})
</script>

<template>
  <div class="notFoundContainer">
    <div class="m-b-xxl has-text-centered">
      <h1 class="title" v-html="title" />
      <nuxt-link :to="navigateToPage" class="button is-primary">
        {{
          navigateToText
        }}
      </nuxt-link>
    </div>
    <h2 class="subtitle">
      {{ status }}<span> 😒</span>
    </h2>
  </div>
</template>

<style scoped>
.title {
  font-size: 40px;
}
.subtitle {
  font-size: 140px;
  text-align: center;
}
.notFoundContainer {
  margin-top: 80px;
}
</style>
