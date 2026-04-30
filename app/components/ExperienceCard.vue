<script setup lang="ts">
import type { Experience } from '~/types'
defineProps<{ experience: Experience }>()
</script>

<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <h2 class="title is-4">
            {{ experience.title }}
          </h2>
        </div>
      </div>
      <div class="content">
        {{ experience.subtitle }}
        <br>
      </div>
    </div>
    <footer class="card-footer">
      <NuxtLink
        :to="`/experiences/${experience.slug}`"
        class="card-footer-item"
        :aria-label="`Read more about ${experience.title}`"
      >
        View experience
      </NuxtLink>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.card-image:hover {
  cursor: pointer;
  opacity: 0.9;
}

.card {
  display: flex;
  flex-flow: column;
  height: 100%;

  .card-content {
    display: flex;
    flex-flow: column;
    flex: 1;
  }
}
</style>
