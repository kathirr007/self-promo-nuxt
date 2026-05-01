<script setup lang="ts">
const { data } = await useFetch('/api/pageview')

const time = useTimeAgo(() => data.value?.startAt || 0)
</script>

<template>
  <div class="text-gray:80">
    <span class="text-gray font-500">{{ data?.pageview }}</span>
    page views since
    <span class="text-gray">{{ time }}</span>
  </div>
</template>
