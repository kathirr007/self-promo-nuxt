<template>
  <div>
    <!-- Hero Section -->
    <!-- <hero
      :title="projectHero.title"
      :subtitle="projectHero.subtitle"
      :image="projectHero.image"
      :promoLink="projectHero.product && projectHero.product.productLink"
    />-->
    <LazyHydrate when-idle>
      <hero-slider :heroes="projectHeros" />
    </LazyHydrate>
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
              <LazyHydrate when-idle>
                <project-card :project="project" />
              </LazyHydrate>
              <template slot="popover">
                <LazyHydrate on-interaction>
                  <project-card-tooltip
                    :title="project.title"
                    :subtitle="project.category.name"
                    :description="project.subtitle"
                    :wsl="project.wsl"
                  />
                </LazyHydrate>
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
            v-for="experience in featuredExperiences"
            :key="experience._id"
            class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd"
          >
            <!-- CARD-ITEM -->
            <LazyHydrate when-visible>
              <experience-card :experience="experience" />
            </LazyHydrate>
            <!-- CARD-ITEM-END -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import hero from "~/components/shared/hero";
// import heroSlider from "~/components/shared/heroSlider";
// import projectCard from "~/components/projectCard";
// import experienceCard from "~/components/experienceCard";
// import ProjectCardTooltip from "~/components/ProjectCardTooltip";
import LazyHydrate from "vue-lazy-hydration";
import { mapState } from "vuex";
export default {
  components: {
    LazyHydrate,
    hero: () => import("~/components/shared/hero"),
    heroSlider: () => import("~/components/shared/heroSlider"),
    projectCard: () => import("~/components/projectCard"),
    experienceCard: () => import("~/components/experienceCard"),
    ProjectCardToolti: () => import("~/components/ProjectCardTooltip")
  },
  computed: {
    ...mapState({
      projects: state => state.project.items,
      featuredExperiences: state => state.experiences.items.featured,
      projectHero: state => state.heroes.projectHero || {},
      projectHeros: state => state.heroes.projectHero || {}
    })
  },
  async fetch({ store }) {
    // debugger
    await store.dispatch("project/fetchProjects");
    await store.dispatch("experiences/fetchFeaturedExperiences", {
      "filter[featured]": true
    });
  }
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
