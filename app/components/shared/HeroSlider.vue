<script setup lang="ts">
import type { HeroSliderProps } from '~/types'

const props = withDefaults(defineProps<HeroSliderProps>(), {
  heroes: () => [],
  title: 'Super Amazing Promo',
  subtitle: 'Super Amazing Promo Subtitle',
  image: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1631&q=80',
})

const containerRef = ref(null)
const slides = ref(Array.from({ length: 10 }))
const swiper = useSwiper(containerRef, {
  effect: 'creative',
  loop: true,
  /* autoplay: {
    delay: 5000,
  }, */
  pagination: {
    clickable: true,
    el: '.swiper-pagination',
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
})

const currentIndex = ref(0)

const currentHero = computed(() => props.heroes[currentIndex.value] ?? null)
const heroBackground = computed(() => currentHero.value?.image ?? props.image)
const heroTitle = computed(() => currentHero.value?.title ?? props.title)
const heroSubtitle = computed(() => currentHero.value?.subtitle ?? props.subtitle)
const heroLink = computed(() => {
  const slug = currentHero.value?.project?.slug
  return slug ? `/projects/${slug}` : '/'
})
</script>

<template>
  <section class="hero is-black">
    <ClientOnly v-if="heroes.length">
      <div class="hero-slider">
        <swiper-container ref="containerRef" :init="false">
          <swiper-slide
            v-for="(hero, index) in heroes"
            :key="`${hero.project?.slug || hero.title}-${index}`"
          >
            <div
              class="hero-body"
            >
              <div
                class="hero-img"
                :style="{
                  background: `url(${hero.image || image}) no-repeat top center/cover`,
                }"
              />
              <div class="container px-4 py-4 px-md-6 py-md-6">
                <h1 class="title">
                  {{ hero.title }}
                </h1>
                <h2 class="subtitle is-hidden-mobile">
                  {{ hero.subtitle }}
                </h2>
                <NuxtLink
                  :to="hero.project?.slug ? `/projects/${hero.project.slug}` : '/'"
                  class="button is-danger m-t-md"
                >
                  Project Details
                </NuxtLink>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
        <div class="swiper-pagination" />
      </div>
    </ClientOnly>

    <div v-else class="hero-body" :style="{ background: `url(${heroBackground}) no-repeat center center/cover` }">
      <div class="hero-img" />
      <div class="container px-4 py-4 px-md-6 py-md-6">
        <h1 class="title">
          {{ heroTitle }}
        </h1>
        <h2 class="subtitle is-hidden-mobile">
          {{ heroSubtitle }}
        </h2>
        <NuxtLink :to="heroLink" class="button is-danger">
          Learn More!
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero-slider {
  position: relative;

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    color: white;
  }

  :deep(.swiper-pagination) {
    position: absolute;
    right: 1.25rem;
    bottom: 1.25rem;
    left: 1.25rem;
    z-index: 2;
    display: flex;
    justify-content: center;
    gap: 0.6rem;
  }

  :deep(.swiper-pagination-bullet) {
    width: 0.55rem;
    height: 0.55rem;
    margin: 0 !important;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.45);
    opacity: 1;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  :deep(.swiper-pagination-bullet-active) {
    transform: scale(1.15);
    border-color: #ff3860;
    background: #ff3860;
    box-shadow: 0 0 0 4px rgba(255, 56, 96, 0.18);
  }

  @media screen and (max-width: 576px) {
    :deep(.swiper-pagination) {
      right: 0.75rem;
      bottom: 0.75rem;
      left: 0.75rem;
      gap: 0.45rem;
    }

    :deep(.swiper-pagination-bullet) {
      width: 0.5rem;
      height: 0.5rem;
    }
  }
}

.hero-body {
  position: relative;
  // min-height: 22rem;
  display: flex;
  align-items: center;
}

.hero-img {
  opacity: 0.4;
  position: absolute;
  inset: 0;
  background-size: cover;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 100%;
  overflow: hidden;
}

.is-black {
  background-color: black;
}

.title {
  font-size: 25px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  line-height: 1.3;
  max-width: 100%;

  @media screen and (min-width: 576px) {
    font-size: 30px;
  }

  @media screen and (max-width: 576px) {
    font-size: 20px;
    line-height: 1.2;
  }
}

.subtitle {
  font-size: 22px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;

  @media screen and (max-width: 576px) {
    font-size: 16px;
  }
}

swiper-slide {
  // display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: 300px;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;

  &:not(.swiper-slide-active) {
    .hero-body {
      opacity: 0;
    }
  }
}
</style>
