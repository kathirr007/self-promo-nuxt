<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const router = useRouter()
const adminExperienceStore = useAdminExperienceStore()

async function saveExperience(experienceData: Record<string, any>) {
  const experience = await adminExperienceStore.createExperience(experienceData) as any
  await router.push(`/admin/experience/${experience._id}/edit`)
}
</script>

<template>
  <div>
    <SharedHeader title="Write your Experiences" exit-link="/admin/experiences" />
    <div class="experience-editor-container">
      <div class="container">
        <Editor @editor-updated="saveExperience" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.experience-editor-container {
  padding-top: 60px;
}
</style>
