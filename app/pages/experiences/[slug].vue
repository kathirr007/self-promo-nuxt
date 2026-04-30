<script setup lang="ts">
const route = useRoute()
const experiencesStore = useExperiencesStore()

const { data: experience } = await useAsyncData(`experience-${route.params.slug}`, async () => {
  await experiencesStore.fetchExperienceBySlug(route.params.slug as string)
  return experiencesStore.item
})

useHead({
  title: computed(() => experience.value?.title ?? 'Experience'),
  meta: [{ name: 'description', content: computed(() => experience.value?.subtitle ?? '') as any }],
})
</script>

<template>
  <div v-if="experience" class="experience-editor-container p-4">
    <div class="container">
      <EditorView :initial-content="experience.content" />
    </div>
  </div>
  <div v-else class="container">
    <SharedErrorView
      title="Ooooops, the page you are trying to access doesn't exist 😒"
      status="404"
      navigate-to-page="/"
      navigate-to-text="Navigate back to Home Page"
    />
  </div>
</template>

<style lang="scss" scoped>
.experience-editor-container {
  margin: 10px auto;
}
</style>
