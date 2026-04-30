<script setup lang="ts">
import type { ProjectCardTooltipProps } from '~/types'

withDefaults(defineProps<ProjectCardTooltipProps>(), {
  title: '',
  subtitle: '',
  description: '',
  wsl: () => [],
})
</script>

<template>
  <article class="card-tooltip">
    <p class="tooltip-title">
      {{ title }}
    </p>
    <p v-if="subtitle" class="tooltip-subtitle">
      {{ subtitle }}
    </p>
    <p v-if="description" class="tooltip-description">
      {{ description }}
    </p>
    <ul v-if="wsl.length" class="wsl-list">
      <li v-for="item in wsl" :key="item.value" class="wsl-item">
        {{ item.value }}
      </li>
    </ul>
  </article>
</template>

<style scoped lang="scss">
.card-tooltip {
  width: min(21rem, calc(100vw - 2rem));
  padding: 1.35rem 1.35rem 1.15rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 0.9rem;
  background: #fff;
  color: #1f2937;
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.18),
    0 4px 12px rgba(15, 23, 42, 0.08);
}

.tooltip-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
}

.tooltip-subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.96rem;
  font-style: italic;
  color: #4b5563;
}

.tooltip-description {
  margin: 1rem 0 0;
  font-size: 1rem;
  line-height: 1.55;
  color: #374151;
}

.wsl-list {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.wsl-item {
  position: relative;
  padding-left: 1.15rem;
  font-size: 0.96rem;
  line-height: 1.45;
  color: #374151;
}

.wsl-item + .wsl-item {
  margin-top: 0.55rem;
}

.wsl-item::before {
  content: '';
  position: absolute;
  top: 0.52rem;
  left: 0;
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: #22c55e;
}
</style>
