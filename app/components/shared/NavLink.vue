<script setup lang="ts">
const props = defineProps<{ to: string }>()
const route = useRoute()
const isActive = computed(() => props.to === route.path)
</script>

<template>
  <NuxtLink :to="to" :class="{ 'is-active': isActive }">
    <slot />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.is-active {
  border-bottom: 4px solid #32a0ff;
  font-weight: bold;
}
</style>
