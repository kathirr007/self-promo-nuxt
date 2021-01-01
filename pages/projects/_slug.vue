<template>
  <div>
    <product-hero
      :title="course.title"
      :subtitle="course.subtitle"
      :author="course.author"
    >
      <product-hero-card
        :navigateTo="course.productLink"
        :image="course.image"
        :images="course.images"
        :repoLink="course.promoVideoLink"
      />
    </product-hero>
    <div class="container">
      <div class="columns">
        <div class="column">
          <div class="section p-0">
            <div class="technologies">
              <div class="technologies-title">Technologies used</div>
              <ul class="technologies-items">
                <li
                  v-for="wsl in course.wsl"
                  :key="wsl.value"
                  class="technologies-item"
                >
                  <span>{{ wsl.value }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="section project-description py-2 px-0">
            <div class="project-description-title">Project Info</div>
            <div class="project-description-details">
              <div v-html="course.description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductHero from "~/components/ProductHero";
import ProductHeroCard from "~/components/ProductHeroCard";
export default {
  head() {
    return {
      title: this.course.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.course.subtitle,
        },
      ],
    };
  },
  data() {
    return {};
  },
  components: {
    ProductHero,
    ProductHeroCard,
  },
  computed: {
    course() {
      return this.$store.state.course.item;
    },
  },
  async fetch({ store, params }) {
    await store.dispatch("course/fetchCourseBySlug", params.slug);
  },
};
</script>

<!-- Fetch course by Slug -->
<!-- 1. create action "fetchCourseBySlug" in store/course.js -->
<!-- 2. send GET request '/api/v1/products/s/:slug' -->
<!-- 3. expect to receive "course" in "then" and commit it to state -->
<!-- 4. get course in computed properties -->
<!-- 5. Complete TODO's -->
<!-- 6. Navigate to detail page from home page when clicking on "Learn More" -->

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