<script setup lang="ts">
useHead({ title: 'Experiences | Kathiravan K | Sr.UI Developer' })

const router = useRouter()
const route = useRoute()
const experiencesStore = useExperiencesStore()

const pagination = computed(() => experiencesStore.pagination)
const publishedExperiences = computed(() => experiencesStore.items.all)
const featuredExperiences = computed(() => experiencesStore.items.featured)

const currentPage = computed({
  get: () => pagination.value.pageNum,
  set: (value: number) => experiencesStore.setPage(value),
})

await useAsyncData('experiences', async () => {
  const query = route.query
  const filter: Record<string, any> = {}

  if (query.pageNum && query.pageSize) {
    filter.pageNum = Number(query.pageNum)
    filter.pageSize = Number(query.pageSize)
    experiencesStore.setPage(filter.pageNum)
  }
  else {
    filter.pageNum = pagination.value.pageNum
    filter.pageSize = pagination.value.pageSize
  }

  return await Promise.all([
    experiencesStore.fetchExperiences(filter),
    experiencesStore.fetchFeaturedExperiences({ 'filter[featured]': true }),
  ])
})

function displayExperienceTitle(experience: Record<string, any>): string {
  return experience.title || experience.subtitle || 'Experience without title or subtitle 😒'
}

function setQueryPaginationParams() {
  const { pageSize, pageNum } = pagination.value
  router.push({ query: { pageNum: String(pageNum), pageSize: String(pageSize) } })
}

async function fetchExperiences() {
  const filter = { pageNum: pagination.value.pageNum, pageSize: pagination.value.pageSize }
  await experiencesStore.fetchExperiences(filter)
  setQueryPaginationParams()
}
</script>

<template>
  <div>
    <section class="section p-3">
      <div class="container">
        <h1 class="title">
          Experiences
        </h1>
        <div class="columns is-multiline section-cards">
          <div class="column is-8 infinite-loader">
            <transition name="page-fade" mode="out-in">
              <div :key="currentPage" class="experiences-list">
                <div
                  v-for="experience in publishedExperiences"
                  :key="experience.slug"
                  class="section"
                >
                  <transition appear name="slideDown" mode="out-in">
                    <div class="experience">
                      <div
                        class="experience-header clickable"
                        tabindex="0"
                        @click="router.push(`/experiences/${experience.slug}`)"
                        @keypress.enter="router.push(`/experiences/${experience.slug}`)"
                      >
                        <h2 class="title is-4">
                          {{ displayExperienceTitle(experience) }}
                        </h2>
                        <h3 class="subtitle is-5">
                          {{ experience.subtitle }}
                        </h3>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>

            <div v-if="pagination.pageCount && pagination.pageCount > 1" class="section has-text-centered-mobile">
              <nav class="pagination" role="navigation" aria-label="pagination">
                <button
                  class="pagination-previous"
                  :disabled="currentPage <= 1"
                  @click="currentPage > 1 && (currentPage--, fetchExperiences())"
                >
                  Prev
                </button>
                <button
                  class="pagination-next"
                  :disabled="currentPage >= pagination.pageCount"
                  @click="currentPage < pagination.pageCount && (currentPage++, fetchExperiences())"
                >
                  Next
                </button>
                <ul class="pagination-list">
                  <li v-for="page in pagination.pageCount" :key="page">
                    <button
                      class="pagination-link"
                      :class="{ 'is-current': page === currentPage }"
                      :aria-label="`Page ${page}`"
                      @click="currentPage = page; fetchExperiences()"
                    >
                      {{ page }}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div class="column is-4 is-narrow">
            <div class="section">
              <div class="sidebar">
                <div class="sidebar-header">
                  <h4 class="title is-4">
                    Recent Experiences
                  </h4>
                </div>
                <div class="sidebar-list">
                  <p v-for="fexperience in featuredExperiences" :key="fexperience._id">
                    <NuxtLink :to="`/experiences/${fexperience.slug}`">
                      {{ fexperience.title }}
                    </NuxtLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.experience-content {
  font-style: italic;
}
.clickable {
  cursor: pointer;
}
a {
  transition: all 0.35s;
  color: #000;
}

.experience-header,
.sidebar-header-single {
  border-color: #d74436;
  padding-left: 1rem;
  border-left: 4px solid #d74436;
}

.experience-header .title {
  font-weight: 700;
  font-size: 1.8rem;
  color: rgba(0, 0, 0, 0.84) !important;
}

.experience-header .subtitle {
  font-size: 1.1rem;
}

.sidebar-header {
  border-color: #d74436;
  padding-bottom: 1rem;
  border-bottom: 4px solid #d74436;
  .title {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.3rem;
  }
}

.sidebar-list {
  padding-top: 1.4rem;
  a {
    color: #4a4a4a;
  }
  p {
    font-size: 1.1rem;
    font-weight: 300;
    padding-bottom: 0.8rem;
  }
}

.section {
  padding: 0 0 2rem 0;
}

.pagination-link.is-current {
  background-color: #d74436;
  border-color: #d74436;
  color: #fff;
}

.experiences-list {
  min-height: 200px;
}
</style>
