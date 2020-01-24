<template>
  <div>
    <!-- Hero Section -->
    <hero />
    <!-- Hero Section end -->
    <section class="section">
      <div class="container">
        <h1 class="title">Featured Courses</h1>
        <div class="columns">
          <div v-for="course in courses" :key="course._id" class="column is-one-quarter">
            <!-- CARD-ITEM -->
            <course-card :course="course" />
            <!-- CARD-ITEM-END -->
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">Featured Articles</h1>
        <div class="columns">
          <div class="column is-one-quarter">
            <!-- CARD-ITEM -->
            <blog-card />
            <!-- CARD-ITEM-END -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import hero from '~/components/shared/hero'
import courseCard from '~/components/courseCard'
import blogCard from '~/components/blogCard'
import { mapState } from 'vuex'
export default {
  components: {
    hero, courseCard, blogCard
  },
  computed: {
    ...mapState({
      courses: state => state.course.items
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