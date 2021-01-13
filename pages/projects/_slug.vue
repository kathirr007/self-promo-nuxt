<template>
  <div>
    <product-hero
      :title="project.title"
      :subtitle="project.subtitle"
      :author="project.author"
    >
      <product-hero-card
        :navigateTo="project.productLink"
        :image="project.image"
        :images="project.images"
        :repoLink="project.promoVideoLink"
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
                  v-for="wsl in project.wsl"
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
              <div v-html="project.description"></div>
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
      title: this.project.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.project.subtitle,
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
    project() {
      return this.$store.state.project.item;
    },
  },
  async fetch({ store, params }) {
    await store.dispatch("project/fetchCourseBySlug", params.slug);
  },
};
</script>

<!-- Fetch project by Slug -->
<!-- 1. create action "fetchCourseBySlug" in store/project.js -->
<!-- 2. send GET request '/api/v1/products/s/:slug' -->
<!-- 3. expect to receive "project" in "then" and commit it to state -->
<!-- 4. get project in computed properties -->
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