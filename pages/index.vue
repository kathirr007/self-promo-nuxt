<template>
  <div>
    <!-- Hero Section -->
    <!-- <hero
      :title="courseHero.title"
      :subtitle="courseHero.subtitle"
      :image="courseHero.image"
      :promoLink="courseHero.product && courseHero.product.productLink"
    />-->
    <hero-slider :heroes="courseHeros" />
    <!-- <hero v-else/> -->

    <!-- Hero Section end -->
    <section class="section p-3">
      <div class="container">
        <h1 class="title my-3">Featured Projects</h1>
        <div class="columns is-multiline section-cards">
          <div
            v-for="course in courses"
            :key="course._id"
            class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd is-flex"
          >
            <!-- CARD-ITEM -->
            <v-popover
              offset="16"
              trigger="hover"
              placement="right-start"
              class="slide-left is-flex is-flex-grow-1"
            >
              <course-card :course="course" />
              <template slot="popover">
                <course-card-tooltip
                  :title="course.title"
                  :subtitle="course.category.name"
                  :description="course.subtitle"
                  :wsl="course.wsl"
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
        <h1 class="title my-3">Featured Articles</h1>
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
import courseCard from "~/components/courseCard";
import blogCard from "~/components/blogCard";
import CourseCardTooltip from "~/components/CourseCardTooltip";
import { mapState } from "vuex";
export default {
  components: {
    hero,
    heroSlider,
    courseCard,
    blogCard,
    CourseCardTooltip,
  },
  computed: {
    ...mapState({
      courses: (state) => state.course.items,
      featuredBlogs: (state) => state.experiences.items.featured,
      courseHero: (state) => state.heroes.courseHero || {},
      courseHeros: (state) => state.heroes.courseHero || {},
    }),
  },
  async fetch({ store }) {
    // debugger
    await store.dispatch("course/fetchCourses");
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