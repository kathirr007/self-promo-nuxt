<script setup lang="ts">
interface Author {
  name: string
  avatar: string
}

interface Props {
  title?: string
  subtitle?: string
  author?: Author | null
}

withDefaults(defineProps<Props>(), {
  title: 'Some Default Catchy Title',
  subtitle: 'Some Default Catchy Subtitle',
  author: null,
})
</script>

<template>
  <section class="hero is-black">
    <div class="hero-body p-4">
      <div class="hero-img" />
      <div class="container">
        <div class="columns">
          <div class="column is-three-quarters-desktop is-7">
            <h1 class="title">
              {{ title }}
            </h1>
            <h2 class="subtitle">
              {{ subtitle }}
            </h2>
            <div v-if="author" class="sub-subtitle">
              <SharedUserTile :name="author.name" :avatar="author.avatar" />
            </div>
          </div>
          <div class="column is-one-quarters-desktop is-relative">
            <div class="column-right is-justify-content-center is-flex">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-body {
  position: relative;
}

.hero-img {
  opacity: 0.8;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover;
  filter: sepia(0.1) grayscale(0.1) saturate(0.8);
}

.column-right {
  position: absolute;
  right: 0;
}

@media screen and (max-width: 578px) {
  .column-right {
    position: inherit;
  }
}

.is-black {
  background: linear-gradient(#29303b, #29303b, #29303b);
}

.title {
  font-weight: bold;
  font-size: 25px;
}

.subtitle {
  font-size: 20px;
}
</style>
