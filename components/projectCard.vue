<template>
  <div class="card">
    <div class="card-image">
      <!-- <client-only>
              <vue-picture-swipe :items="vpsImages" />
      </client-only>-->
      <client-only v-if="vfImages.length > 1">
        <vue-flux
          :options="vfOptions"
          :images="vfImages"
          :transitions="vfTransitions"
          ref="slider"
          class="flux-slider"
        >
          <!-- <template v-slot:preloader>
                  <flux-preloader />
          </template>-->
          <!-- <template v-slot:caption>
                  <flux-caption />
          </template>-->
          <template v-slot:controls>
            <flux-controls />
          </template>
          <template v-slot:pagination>
            <flux-pagination />
          </template>
          <!-- <template v-slot:index>
                  <flux-index />
          </template>-->
        </vue-flux>
      </client-only>
      <img
        v-else-if="vfImages && vfImages.length == 1"
        :src="project.image"
        alt="Project Image"
      />
      <img
        v-else
        src="https://via.placeholder.com/265x145?text=Kathirr007+Portfolio"
        alt="Placeholder image"
      />
      <!-- <figure class="image is-4by2">
      </figure>-->
    </div>
    <!-- <nuxt-link :to="`/projects/${project.slug}`">
    </nuxt-link>-->
    <div class="card-content">
      <div class="content">
        <p class="title is-4">{{ project.title | shortenText(45) }}</p>
        <!-- <p class="subtitle is-6"><i>by {{project.author.name}}</i></p> -->
      </div>
      <div class="content">
        {{ project.subtitle | shortenText(45) }}
        <br />
      </div>
      <!-- <div class="price-box">
                <span class="price">{{project.price}}$</span>
                <span class="disc-price">{{project.discountedPrice}}$</span>
      </div>-->
    </div>
    <footer class="card-footer">
      <nuxt-link :to="`/projects/${project.slug}`" class="card-footer-item"
        >More Details</nuxt-link
      >
      <!-- <a target="_" :href="project.productLink" class="card-footer-item">Enroll</a> -->
    </footer>
  </div>
</template>

<script>
// import { VueFlux } from 'vue-flux/dist-ssr/vue-flux.umd';

import {
  VueFlux,
  FluxControls,
  FluxPagination,
  FluxPreloader,
} from "vue-flux/dist-ssr/vue-flux.umd.min.js";

// import VuePictureSwipe from 'vue-picture-swipe';

import "vue-flux/dist-ssr/vue-flux.css";

// if (process.browser) {
//     const { VF } = require('vue-flux');
// }

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  components: {
    VueFlux,
    FluxControls,
    FluxPagination,
    // FluxPreloader,
    // VuePictureSwipe
  },

  data: () => ({
    vfOptions: {
      autoplay: true,
      delay: 1500,
    },
    // vfImages: ['URL1', 'URL2', 'URL3'],
    vfTransitions: ["slide"],
  }),
  computed: {
    vfImages() {
      return this.project.images.map((image) => {
        return image.location;
      });
    },
    /*           vpsImages() {
            return this.project.images.map(image => ({
              src: image.location,
              thumbnail: image.location,
              w: '100',
              h: '100'
            }))
          } */
  },
};
</script>

<style lang="scss" scoped>
.card-image {
  height: 175px;
  overflow: hidden;
  position: relative;
  padding: 10px;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: top;
  }

  &:hover {
    /* cursor: pointer; */
    opacity: 0.9;
  }
  @media screen and (min-width: 768px) {
    height: 150px;
    padding: 0;
    img {
      object-fit: cover;
      object-position: top;
    }
  }
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

    .content {
      display: flex;
      flex: 1;
    }
  }
}
.vue-flux.flux-slider {
  height: 100% !important;
  width: 100% !important;
}
</style>
<style lang="scss">
.vue-flux {
  &.flux-slider {
    .flux-image {
      background-size: cover !important;
      background-position: top center !important;
    }
  }
}
.tooltip {
  .card {
    border-radius: 5px;
    box-shadow: 2px 2px 5px 0px $card-shadow-color;
  }
  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: #fff;
    z-index: 1;
  }

  &[x-placement^="right"],
  &[x-placement^="left"] {
    .tooltip-arrow {
      display: none;
      @media screen and (min-width: 768px) {
        display: block;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        top: calc(50% - 15px) !important;
        margin-left: 0;
        margin-right: 0;
      }
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      display: none;
      @media screen and (min-width: 768px) {
        display: block;
        border-width: 15px 15px 15px 0;
        border-left-color: transparent !important;
        left: -15px;
      }
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      display: none;
      @media screen and (min-width: 768px) {
        display: block;
        border-width: 15px 0 15px 15px;
        border-right-color: transparent !important;
        right: -15px;
      }
    }
  }

  &[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.25s, visibility 0.25s;
  }

  &[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.25s;
    z-index: 99;
  }
}
</style>