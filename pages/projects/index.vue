<template>
  <div>
    <!-- Hero Section -->
    <!-- <hero v-else/> -->
    <!-- Hero Section end -->
    <section class="section p-3">
      <div class="container">
        <h1 class="title">All Projects</h1>
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
  </div>
</template>

<script>
import projectCard from "~/components/projectCard";
import ProjectCardTooltip from "~/components/ProjectCardTooltip";
import { mapState } from "vuex";
export default {
  head: {
    title: `Projects | Kathiravan K | Sr.UI Developer`,
  },
  components: {
    projectCard,
    ProjectCardTooltip,
  },
  computed: {
    ...mapState({
      projects: (state) => state.project.items,
    }),
  },
  async fetch({ store }) {
    // debugger
    await store.dispatch("project/fetchCourses");
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
</style>
<style lang="scss">
</style>