<template>
  <div>
    <!-- Hero Section -->
    <!-- <hero
      :title="projectHero.title"
      :subtitle="projectHero.subtitle"
      :image="projectHero.image"
      :promoLink="projectHero.product && projectHero.product.productLink"
    />-->
    <hero-slider :heroes="projectHeros" />
    <!-- <hero v-else/> -->

    <!-- Hero Section end -->
    <section class="section p-3">
      <div class="container">
        <h1 class="title my-3">Featured Projects</h1>
        <div class="columns is-multiline section-cards">
          <div
            v-for="project in projects"
            :key="project._id"
            class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd is-flex"
          >
            <!-- CARD-ITEM -->
            <v-popover
              offset="16"
              trigger="hover"
              placement="right-start"
              class="slide-left is-flex is-flex-grow-1"
            >
              <project-card :project="project" />
              <template slot="popover">
                <project-card-tooltip
                  :title="project.title"
                  :subtitle="project.category.name"
                  :description="project.subtitle"
                  :wsl="project.wsl"
                />
              </template>
            </v-popover>
            <!-- CARD-ITEM-END -->
          </div>
        </div>
      </div>
    </section>
    <section class="section p-3">
      <div class="container">
        <h1 class="title my-3">Recent Experiences</h1>
        <div class="columns is-multiline section-cards">
          <div
            v-for="blog in featuredBlogs"
            :key="blog._id"
            class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd"
          >
            <!-- CARD-ITEM -->
            <blog-card :blog="blog" />
            <!-- CARD-ITEM-END -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import hero from "~/components/shared/hero";
import heroSlider from "~/components/shared/heroSlider";
import projectCard from "~/components/projectCard";
import blogCard from "~/components/blogCard";
import ProjectCardTooltip from "~/components/ProjectCardTooltip";
import { mapState } from "vuex";
export default {
  components: {
    hero,
    heroSlider,
    projectCard,
    blogCard,
    ProjectCardTooltip,
  },
  computed: {
    ...mapState({
      projects: (state) => state.project.items,
      featuredBlogs: (state) => state.experiences.items.featured,
      projectHero: (state) => state.heroes.projectHero || {},
      projectHeros: (state) => state.heroes.projectHero || {},
    }),
  },
  async fetch({ store }) {
    // debugger
    await store.dispatch("project/fetchCourses");
    await store.dispatch("experiences/fetchFeaturedBlogs", {
      "filter[featured]": true,
    });
  },
};
</script>

<style scoped lang="scss">
// card item

// card item end

// hero

// hero

// Home page
.links {
  padding-top: 15px;
}
.slide-left {
  > div {
    /* height: 100%; */
  }
}
</style>
<style lang="scss">
.v-popover {
  &.slide-left {
    .trigger {
      width: 100%;
    }
  }
}
.toasted {
  &.toasted-primary {
    strong {
      color: #fff !important;
      font-weight: bold;
    }
  }
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