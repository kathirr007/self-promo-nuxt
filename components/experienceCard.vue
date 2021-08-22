<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ experience.title }}</p>
          <!-- <p class="subtitle is-6">
            <i>by {{experience.author.name}}</i>
          </p>-->
        </div>
      </div>
      <div class="content">
        {{ experience.subtitle }}
        <br />
      </div>
    </div>
    <footer class="card-footer">
      <nuxt-link
        :to="`/experiences/${experience.slug}`"
        class="card-footer-item"
        :aria-label="`Read more about ${experience.title}`"
        >Read More</nuxt-link
      >
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    experience: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.card-image:hover {
  cursor: pointer;
  opacity: 0.9;
}

.price-box {
  text-align: right;

  .price {
    color: gray;
    font-size: 16px;
    text-decoration: line-through;
  }

  .disc-price {
    font-size: 21px;
    font-weight: bold;
  }
}

.card {
  display: flex;
  flex-flow: column;
  height: 100%;

  .card-content {
    display: flex;
    flex-flow: column;
    flex: 1;
  }
}
</style>
