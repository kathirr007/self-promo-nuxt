<script setup lang="ts">
useHead({ title: 'Kathiravan K | Sr.UI Developer' })

const projectStore = useProjectStore()
const experiencesStore = useExperiencesStore()
const heroesStore = useHeroesStore()

await useAsyncData('home', async () => {
  return await Promise.all([
    projectStore.fetchProjects(),
    experiencesStore.fetchFeaturedExperiences({ 'filter[featured]': true }),
    heroesStore.fetchHero(),
  ])
})

const projects = computed(() => projectStore.items)
const featuredExperiences = computed(() => experiencesStore.items.featured)
const projectHeroes = computed(() => heroesStore.projectHero ? Array.isArray(heroesStore.projectHero) ? heroesStore.projectHero : [heroesStore.projectHero] : [])
</script>

<template>
  <div>
    <SharedHeroSlider :heroes="(projectHeroes as Hero[])" />

    <section class="section p-3">
      <div class="container">
        <h1 class="title my-3">
          Featured Projects
        </h1>
        <div v-if="projects.length" class="columns is-multiline section-cards">
          <div
            v-for="project in projects"
            :key="project._id"
            class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd is-flex"
          >
            <div class="is-flex is-flex-grow-1 project-card-wrap">
              <ProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section p-3">
      <div class="container">
        <h1 class="title my-3">
          Recent Experiences
        </h1>
        <div class="columns is-multiline section-cards">
          <div
            v-for="experience in featuredExperiences"
            :key="experience._id"
            class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd"
          >
            <ExperienceCard :experience="experience" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
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

.project-card-wrap {
  width: 100%;
}
</style>
