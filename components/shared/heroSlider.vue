<template>
  <section class="hero is-black">
    <swiper v-if="heroes.length !== 0" class="swiper hero-slider" :options="swiperOption">
      <swiper-slide class="hero-body" v-for="(hero, i) in heroes" :key="i">
        <div
          class="hero-img"
          :style="{
            background: `url(${
              hero.image !== undefined ? hero.image : ''
            }) no-repeat top center/cover`,
          }"
        ></div>
        <div class="container px-4 py-2">
          <h1 class="title">{{ hero.title }}</h1>
          <h2 class="subtitle is-hidden-mobile">{{ hero.subtitle }}</h2>
          <nuxt-link
            target="_"
            :to="hero.product !== null ? `projects/${hero.product.slug}` : '/'"
            class="button is-danger"
          >More Details</nuxt-link>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div v-else class="hero-body">
      <div class="hero-img" :style="{ background: `url(${image}) no-repeat center center` }"></div>
      <div class="container px-4 py-2">
        <h1 class="title">{{ title }}</h1>
        <h2 class="subtitle is-hidden-mobile">{{ subtitle }}</h2>
        <nuxt-link target="_" :to="'/'" class="button is-danger">Learn More!</nuxt-link>
      </div>
    </div>
    <!-- <div class="hero-body">
            <div class="hero-img"
                :style="{ background : `url(${image}) no-repeat center center`}">
            </div>
            <div class="container px-4 py-2">
                <h1 class="title">
                    {{title}}
                </h1>
                <h2 class="subtitle is-hidden-mobile">
                    {{subtitle}}
                </h2>
                <a target="_" :href="promoLink" class="button is-danger">Learn More!</a>
            </div>
    </div>-->
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  props: {
    heroes: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "Super Amazing Promo",
    },
    subtitle: {
      type: String,
      default: "Super Amazing Promo Subtitle",
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1631&q=80",
    },
    promoLink: {
      type: String,
      default: "#",
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOption: {
        direction: "horizontal",
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        },
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          // dynamicBullets: true
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.hero-body {
  position: relative;
}

.hero-img {
  opacity: 0.8;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.user-avatar {
  display: inline-block;
}

.is-black {
  background-color: black;
}

.title {
  // font-weight: bold;
  font-size: 25px;
  @media screen and (min-width: 576px) {
    font-size: 30px;
  }
}

.subtitle {
  /*font-weight: bold;*/
  font-size: 22px;
}

.author-name {
  font-size: 20px;
  font-weight: bold;
}
.swiper {
  height: 300px;
  width: 100%;
}
</style>
<style lang="scss">
.hero-slider.swiper {
  .swiper-pagination-bullet {
    background-color: #fbfbfb;
    opacity: 0.25;
    &-active {
      background-color: $primary;
      opacity: 1;
    }
  }
}
</style>