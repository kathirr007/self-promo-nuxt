<script setup lang="ts">
useHead({ title: 'Projects | Kathiravan K | Sr.UI Developer' })

const projectStore = useProjectStore()
await useAsyncData('projects', () => projectStore.fetchProjects())
const projects = computed(() => projectStore.items)
</script>

<template>
  <div>
    <section class="section p-3">
      <div class="container">
        <h1 class="title">
          All Projects
        </h1>
        <div class="columns is-multiline section-cards">
          <div
            v-for="project in projects"
            :key="project._id"
            class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd is-flex"
          >
            <div class="is-flex is-flex-grow-1" :title="project.title">
              <ProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.links {
  padding-top: 15px;
}
.section-cards {
  .column {
    padding-right: 0;
    padding-left: 0;
    @media screen and (min-width: 576px) {
      padding-right: 0.75rem;
      padding-left: 0.75rem;
    }
  }
}
</style>
