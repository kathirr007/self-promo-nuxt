<template>
  <div>
    <section class="section p-3">
      <div class="container">
        <h1 class="title">Experiences</h1>
        <div class="columns is-multiline section-cards">
          <!-- Experiences -->
          <div class="column is-8 infinite-loader">
            <!-- experience -->
            <!-- <transition-group appear name="slideDown" mode="out-in"> -->
            <div
              class="section"
              v-for="experience in publishedExperiences"
              :key="experience.slug"
            >
              <transition appear name="slideDown" mode="out-in">
                <div class="experience">
                  <div
                    @click="$router.push(`/experiences/${experience.slug}`)"
                    class="experience-header clickable"
                  >
                    <!-- <h4 class="title is-4">{{experience.title}}</h4> -->
                    <h2 class="title is-4">
                      {{ displayExperienceTitle(experience) }}
                    </h2>
                    <h3 class="subtitle is-5">{{ experience.subtitle }}</h3>
                  </div>
                  <!-- <div class="experience-content">by {{experience.author.name}}, {{experience.createdAt | formatDate}}</div> -->
                </div>
              </transition>
            </div>
            <!-- <client-only placeholder="Loading...">
            <infinite-loading
              v-if="publishedExperiences.length"
              @infinite="fetchExperiences"
              spinner="spiral"
            ></infinite-loading>
            </client-only>-->
            <!-- </transition-group> -->
            <!-- end of experience -->
            <!-- pagination -->
            <div
              v-if="pagination.pageCount && pagination.pageCount > 1"
              class="section has-text-centered-mobile"
            >
              <client-only placeholder="Loading...">
                <paginate
                  v-model="currentPage"
                  :pageCount="pagination.pageCount"
                  :click-handler="fetchExperiences"
                  :prev-text="'Prev'"
                  :next-text="'Next'"
                  :container-class="'paginationContainer'"
                ></paginate>
              </client-only>
            </div>
            <!-- end of pagination -->
          </div>
          <!-- side bar -->
          <div class="column is-4 is-narrow">
            <!-- featured -->
            <div class="section">
              <div class="sidebar">
                <div class="sidebar-header">
                  <h4 class="title is-4">Recent Experiences</h4>
                </div>
                <div class="sidebar-list">
                  <!-- Featured Experiences -->
                  <p
                    v-for="fexperience in featuredExperiences"
                    :key="fexperience._id"
                  >
                    <nuxt-link :to="`/experiences/${fexperience.slug}`">{{
                      fexperience.title
                    }}</nuxt-link>
                  </p>
                  <!-- Featured Experiences -->
                </div>
              </div>
            </div>
          </div>
          <!-- end of side bar -->
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  head: {
    title: `Experiences | Kathiravan K | Sr.UI Developer`,
  },
  computed: {
    ...mapState({
      publishedExperiences: (state) => state.experiences.items.all,
      featuredExperiences: (state) => state.experiences.items.featured,
      pagination: (state) => state.experiences.pagination,
    }),
    currentPage: {
      get() {
        // debugger
        return this.$store.state.experiences.pagination.pageNum;
      },
      set(value) {
        // debugger
        this.$store.commit("experiences/setPage", value);
      },
    },
  },
  data() {
    return {
      bottom: false,
      // publishedExperiences: []
    };
  },
  async fetch({ store, query }) {
    const filter = {};
    const { pageNum, pageSize } = query;

    if (pageNum && pageSize) {
      filter.pageNum = parseInt(pageNum, 10);
      filter.pageSize = parseInt(pageSize, 10);

      store.commit("experiences/setPage", filter.pageNum);
    } else {
      // filter.pageNum = 1
      // filter.pageSize = 5
      filter.pageNum = store.state.experiences.pagination.pageNum;
      filter.pageSize = store.state.experiences.pagination.pageSize;
    }

    await store.dispatch("experiences/fetchExperiences", filter);
    await store.dispatch("experiences/fetchFeaturedExperiences", {
      "filter[featured]": true,
    });
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.fetchExperiences();
      }
    },
  },
  created() {
    if (process.client) {
      window.addEventListener("scroll", this.bottomVisible);
    }
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  },

  methods: {
    handleScroll(event) {
      // Any code to be executed when the window is scrolled
      console.log("Windows scrolling...");
    },
    bottomVisible() {
      if (process.client) {
        const scrollY = window.scrollY;
        const visible = document.documentElement.clientHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const bottomOfPage = visible + scrollY >= pageHeight;
        return bottomOfPage || pageHeight < visible;
      }
    },
    async loadMoreTours($state) {
      await this.$axios
        .$get("/api/link")
        .then((res) => {
          this.list.push.apply(this.list, res);
          if (res.length > 0) {
            this.page++;
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    displayExperienceTitle(experience) {
      return (
        experience.title ||
        experience.subtitle ||
        "Experience without title or subtitle &#128530;"
      );
    },
    setQueryPaginationParams() {
      const { pageSize, pageNum } = this.pagination;
      this.$router.push({ query: { pageNum, pageSize } });
    },
    fetchExperiences() {
      const filter = {};
      filter.pageNum = this.pagination.pageNum;
      filter.pageSize = this.pagination.pageSize;

      this.$store.dispatch("experiences/fetchExperiences", filter).then((_) => {
        return this.setQueryPaginationParams();
      });
      console.log("Pagination clicked..");
    },
  },
};
</script>
<style scoped lang="scss">
.experience-content {
  font-style: italic;
}

.pagination-content {
  display: flex;
  justify-content: flex-end;
}

.clickable {
  cursor: pointer;
}

#root {
  flex: 1 0 auto;
}

*:focus {
  outline: none;
}

a {
  transition: all 0.35s;
  color: #000;
}

.button:focus {
  border-color: #d74436;
  box-shadow: 0 0 0 0;
}

.input,
.textarea {
  font-size: 1.1rem;
}

.input {
  &[type] {
    font-size: 1.1rem;
  }

  &:focus {
    border: 2px solid #d74436;
  }
}

.textarea:focus,
.input[type]:focus {
  border: 2px solid #d74436;
}

/* this is used when inline-styled content
 overlaps text backgrounds in a really ugly way */

.buffer {
  padding-bottom: 1.1rem;
}

/* navigation */

.nav {
  background-color: #0d0c0d;
}

.nav-left {
  padding-left: 2rem;
}

.nav-right,
.nav-center {
  padding-right: 2rem;
}

a.nav-item {
  &.is-tab {
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    color: #fff;
    padding: 0.4rem;
  }

  &:hover {
    color: #d74436;
  }

  &.is-tab:hover {
    border-bottom: 4px solid #d74436;
  }
}

/* main content */

.main-content {
  padding: 4rem 0 2rem 0;
  min-height: 800px;

  .container {
    padding: 0 2rem 2rem 2rem;
  }
}

/* section */

.section {
  padding: 0 0 2rem 0;
}

.section-header {
  padding-bottom: 3rem;

  .title {
    text-transform: uppercase;
    color: #4a4a4a;
    font-size: 1.3rem;
  }

  a {
    color: #d74436;
    font-weight: 700;

    &:hover {
      color: #e50076;
    }
  }
}

/* sidebar */

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

.sidebar-header-single .title {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.3rem;
}

.sidebar-list p,
.sidebar-list-single p {
  font-size: 1.1rem;
  font-weight: 300;
  padding-bottom: 0.8rem;
}

.sidebar-list {
  a {
    color: #4a4a4a;
  }

  padding-top: 1.4rem;
}

.experience-content,
.sidebar-list-single {
  padding-top: 1.4rem;
}

.sidebar-list-nav {
  padding-top: 1rem;

  .is-tab {
    padding-right: 1rem;
  }
}

.sidebar-footer-single {
  padding-top: 2rem;

  a {
    color: #000;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.1rem;
    border-right: 4px solid #d74436;
    padding-right: 1rem;

    &:hover {
      color: #363636;
    }
  }
}

/* Experience */

.experience-header,
.sidebar-header-single {
  border-color: #d74436;
  padding-left: 1rem;
  border-left: 4px solid #d74436;
}

.experience-header {
  .title {
    font-weight: 700;
    font-size: 1.8rem;
    color: rgba(0, 0, 0, 0.84) !important;
    fill: rgba(0, 0, 0, 0.84) !important;
  }

  .subtitle {
    font-size: 1.1rem;
  }
}

.sidebar-header-single .subtitle {
  font-size: 1.1rem;
}

.experience-content p,
.experience-single-content p {
  margin-bottom: 0.8rem;
}

.experience-content {
  font-size: 1.1rem;
  font-weight: 300;
}

.experience-single-content {
  font-size: 1.1rem;
  font-weight: 300;

  form {
    p:nth-child(even) {
      border-right: 0;
    }

    label {
      text-transform: uppercase;
      color: #4a4a4a;
      padding-bottom: 0.2rem;
    }

    .input[type] {
      padding-top: 0.2rem;
    }
  }

  p:nth-child(even) {
    border-right: 4px solid #d74436;
    padding-right: 1rem;
  }
}

/* override */

.experience-content a {
  color: #d74436;
}

.card-content-form form {
  padding-top: 1.5rem;
}

.experience-footer {
  padding: 1.5rem 0 0 0;
}

/* pagination */

.pagination-content {
  border-right: 4px solid #d74436;
  padding-right: 1rem;
}

.pagination-link.is-current {
  background-color: #d74436;
  border-color: #d74436;
}
</style>
