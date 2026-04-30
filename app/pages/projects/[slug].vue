<script setup lang="ts">
const route = useRoute()
const projectStore = useProjectStore()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, async () => {
  await projectStore.fetchProjectBySlug(route.params.slug as string)
  return projectStore.item
})

useHead({
  title: computed(() => project.value?.title ?? ''),
  meta: [{ name: 'description', content: computed(() => project.value?.subtitle ?? '') as any }],
})
</script>

<template>
  <div>
    <template v-if="project">
      <ProductHero
        :title="project.title"
        :subtitle="project.subtitle"
        :author="project.author"
      >
        <ProductHeroCard
          :navigate-to="project.productLink"
          :image="project.image"
          :images="project.images"
          :repo-link="project.promoVideoLink"
        />
      </ProductHero>
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="section p-0">
              <div class="technologies">
                <div class="technologies-title">
                  Technologies used
                </div>
                <ul class="technologies-items">
                  <li v-for="wsl in project.wsl" :key="wsl.value" class="technologies-item">
                    <span>{{ wsl.value }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="section project-description py-2 px-0">
              <div class="project-description-title">
                Project Info
              </div>
              <div class="project-description-details" v-html="project.description" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="container">
      <SharedErrorView
        title="Ooooops, the page you are trying to access doesn't exist 😒"
        status="404"
        navigate-to-page="/"
        navigate-to-text="Navigate back to Home Page"
      />
    </div>
  </div>
</template>

<style lang="scss">
.technologies {
  background-color: #f9f9f9;
  border: 1px solid #dedfe0;
  padding: 10px 15px;
  @media screen and (min-width: 768px) {
    width: 50%;
  }
  &-title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  &-items {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  &-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 17px;
    width: 45%;
  }
}
.project-description {
  &-title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  &-details {
    font-size: 18px;
    ul {
      list-style: disc;
      margin-left: 20px;
    }
    ol {
      margin-left: 20px;
    }
    strong {
      font-size: 20px;
    }
    p {
      min-height: 30px;
    }
  }
}
</style>
