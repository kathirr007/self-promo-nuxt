<template>
  <div class="instructor-page">
    <instructor-header title="Choose your admin page" exitLink="/">

    </instructor-header>
    <div class="centered">
      <div class="columns column p-lg is-centered">
        <!-- Go to /instructor/categories -->
        <div class="box" @click="$router.push('/instructor/categories')">
          <div>
            Categories
          </div>
        </div>
        <!-- Go to /instructor/courses -->
        <div class="box" @click="$router.push('/instructor/courses')">
          <div>
            Courses
          </div>
        </div>
        <!-- Go to /instructor/blogs -->
        <div class="box" @click="$router.push('/instructor/blogs')">
          <div>
            Blogs
          </div>
        </div>
        <!-- Go to /instructor/heroes -->
        <div class="box" @click="$router.push('/instructor/heroes')">
          <div>
            Heroes
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import instructorHeader from '~/components/shared/Header'
  export default {
    // middleware: 'admin',
    layout: 'instructor',
    components: {
      instructorHeader
    }
  }
</script>
<style scoped lang="scss">
  .instructor-page {
    .centered {
      margin-top: 50px;
      display: flex;
      flex-direction: row;
      /* make main axis horizontal (default setting) */
      justify-content: center;
      /* center items horizontally, in this case */
      align-items: center;
      /* center items vertically, in this case */
    }
  }

  .box {
    height: 300px;
    width: 300px;
    display: flex;
    margin: 5px;
    justify-content: center;

    &:hover {
      cursor: pointer;
      background-color: #58529f;
      color: white;
      transition: background-color 0.3s ease-out;
    }

    >div {
      align-self: center;
      font-size: 50px;
      font-weight: bold;
    }
    @media screen and (max-width:576px) {
      height: auto;
      width: 100%;
      margin: 0;
      margin-bottom: 15px;
      &:last-child{
        margin: 0;
      }
      > div {
        font-size: 30px;
      }
    }
  }
</style>