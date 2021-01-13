<template>
  <div class="card card-tooltip">
    <div class="card-content">
      <div class="content">
        <div class="media-content">
          <!-- Course Title -->
          <p class="title is-4">{{title}}</p>
          <!-- Course Subtitle -->
          <p class="subtitle is-6"><i>{{subtitle}}</i></p>
        </div>
      </div>

      <!-- Course Description -->
      <div class="content" v-html="description">
        <!-- {{description}} -->
      </div>
      <div class="content">
        <ul class="wsl-list">
          <!-- Iterate wsl -->
          <li
            v-for="item in wsl"
            :key="item.value"
            class="wsl-item"
          >
            {{item.value}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        required: false
      },
      subtitle: {
        type: String,
        required: false
      },
      description: {
        type: String,
        required: false
      },
      wsl: {
        type: Array,
        required: false
      },
    }
  }
</script>
<style scoped lang="scss">
  .card-tooltip {
    max-width: 350px;

    .title {
      font-size: 18px;
    }

    .wsl-list {
      margin-left: 13px;

      .wsl-item {
        font-size: 13px;
      }
    }
  }
</style>