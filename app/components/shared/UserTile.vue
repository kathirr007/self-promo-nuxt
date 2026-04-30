<script setup lang="ts">
interface Props {
  name?: string
  avatar?: string
  date?: string
}

withDefaults(defineProps<Props>(), {
  name: '',
  avatar: '',
  date: '',
})
</script>

<template>
  <div class="user-tile">
    <div class="user-tile-image">
      <figure class="image is-64x64">
        <img class="is-rounded" :src="avatar" alt="User avatar" width="64" height="64">
      </figure>
    </div>
    <div class="user-tile-author center">
      <h3 class="user-tile-author-name">
        by {{ name }}
      </h3>
      <div v-if="date" class="date">
        {{ date }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-tile {
  display: flex;

  &-author {
    align-self: center;
    margin-left: 10px;

    &-name {
      font-size: 17px;
    }
  }

  .date {
    font-size: 14px;
  }
}
</style>
