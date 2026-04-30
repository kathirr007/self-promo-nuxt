<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const router = useRouter()
</script>

<template>
  <div class="admin-page">
    <SharedHeader title="Self Promo Admin" exit-link="/" />
    <div class="centered">
      <div class="columns column p-lg is-centered is-multiline">
        <div class="box" role="link" tabindex="0" aria-label="Categories" @click="router.push('/admin/categories')" @keyup.enter="router.push('/admin/categories')">
          <div>Categories</div>
        </div>
        <div class="box" role="link" tabindex="0" aria-label="Projects" @click="router.push('/admin/projects')" @keyup.enter="router.push('/admin/projects')">
          <div>Projects</div>
        </div>
        <div class="box" role="link" tabindex="0" aria-label="Experiences" @click="router.push('/admin/experiences')" @keyup.enter="router.push('/admin/experiences')">
          <div>Experiences</div>
        </div>
        <div class="box" role="link" tabindex="0" aria-label="Heroes" @click="router.push('/admin/heroes')" @keyup.enter="router.push('/admin/heroes')">
          <div>Heroes</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-page {
  .centered {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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
