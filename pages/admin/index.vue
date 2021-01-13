<template>
  <div class="admin-page">
    <admin-header title="Choose your admin page" exitLink="/"></admin-header>
    <div class="centered">
      <div class="columns column p-lg is-centered is-multiline">
        <!-- Go to /admin/categories -->
        <div class="box" @click="$router.push('/admin/categories')">
          <div>Categories</div>
        </div>
        <!-- Go to /admin/projects -->
        <div class="box" @click="$router.push('/admin/projects')">
          <div>Projects</div>
        </div>
        <!-- Go to /admin/blogs -->
        <div class="box" @click="$router.push('/admin/blogs')">
          <div>Experiences</div>
        </div>
        <!-- Go to /admin/heroes -->
        <div class="box" @click="$router.push('/admin/heroes')">
          <div>Heroes</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adminHeader from "~/components/shared/Header";
export default {
  // middleware: 'admin',
  layout: "admin",
  components: {
    adminHeader,
  },
};
</script>
<style scoped lang="scss">
.admin-page {
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

  > div {
    align-self: center;
    font-size: 50px;
    font-weight: bold;
  }
  @media screen and (max-width: 576px) {
    height: auto;
    width: 100%;
    margin: 0;
    margin-bottom: 15px;
    &:last-child {
      margin: 0;
    }
    > div {
      font-size: 30px;
    }
  }
}
</style>