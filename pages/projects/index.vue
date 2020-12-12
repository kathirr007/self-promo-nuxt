<template>
  <div>
    <!-- Hero Section -->
    <!-- <hero v-else/> -->
    <!-- Hero Section end -->
    <section class="section">
      <div class="container">
        <h1 class="title">All Projects</h1>
        <div class="columns is-multiline">
          <div v-for="course in courses" :key="course._id" class="column is-half-tablet is-one-third-widescreen is-one-quarter-fullhd is-flex">
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
  </div>
</template>

<script>
import courseCard from '~/components/courseCard'
import CourseCardTooltip from '~/components/CourseCardTooltip'
import { mapState } from 'vuex'
export default {
  head:{
    title: `Courses | Kathiravan K | Sr.UI Developer`
  },
  components: {
    courseCard, CourseCardTooltip
  },
  computed: {
    ...mapState({
      courses: state => state.course.items,
    })
  },
  async fetch({store}) {
    // debugger
    await store.dispatch('course/fetchCourses')
  }
}
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