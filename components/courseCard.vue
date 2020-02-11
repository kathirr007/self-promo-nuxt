<template>
    <div class="card">
        <div class="card-image">
            <figure class="image is-4by2">
                <img :src="course.image"
                    alt="Placeholder image">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{course.title | shortenText(45)}}</p>
                    <p class="subtitle is-6"><i>by {{course.author.name}}</i></p>
                </div>
            </div>
            <div class="content">
                {{course.subtitle | shortenText(45)}}
                <br>
            </div>
            <div class="price-box">
                <span class="price">{{course.price}}$</span>
                <span class="disc-price">{{course.discountedPrice}}$</span>
            </div>
        </div>
        <footer class="card-footer">
            <nuxt-link :to="`/courses/${course.slug}`" class="card-footer-item">Learn More</nuxt-link>
            <a target="_" :href="course.productLink" class="card-footer-item">Enroll</a>
        </footer>
    </div>
</template>

<script>
    export default {
        props: {
            course: {
                type: Object,
                required: true
            }
        },
    }
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
      .content {
        display: flex;
        flex: 1;
      }
    }
  }
</style>
<style lang="scss">
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
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      top: calc(50% - 15px) !important;
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 15px 15px 15px 0;
      border-left-color: transparent !important;
      left: -15px;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 15px 0 15px 15px;
      border-right-color: transparent !important;
      right: -15px;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .25s, visibility .25s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .25s;
  }
}
</style>