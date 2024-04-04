<template>
  <div class="admin-page">
    <admin-header title="Self Promo Admin" exitLink="/"></admin-header>
    <div class="centered">
      <div class="columns column p-lg is-centered is-multiline">
        <!-- Go to /admin/categories -->
        <div class="box" role="link" tabindex="0" aria-label="Categories" @keyup.enter="$router.push('/admin/categories')" @click="$router.push('/admin/categories')">
          <div>Categories</div>
        </div>
        <!-- Go to /admin/projects -->
        <div class="box" role="link" tabindex="0" aria-label="Projects" @keyup.enter="$router.push('/admin/projects')" @click="$router.push('/admin/projects')">
          <div>Projects</div>
        </div>
        <!-- Go to /admin/experiences -->
        <div class="box" role="link" tabindex="0" aria-label="Experiences" @keyup.enter="$router.push('/admin/experiences')" @click="$router.push('/admin/experiences')">
          <div>Experiences</div>
        </div>
        <!-- Go to /admin/heroes -->
        <div class="box" role="link" tabindex="0" aria-label="Heroes" @keyup.enter="$router.push('/admin/heroes')" @click="$router.push('/admin/heroes')">
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
    adminHeader
  }
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
