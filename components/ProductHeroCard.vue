<template>
<div class="card ">
    <div class="card-image">
        <figure class="image is-4by2">
            <img :src="image" alt="Placeholder image">
        </figure>
    </div>
    <div class="card-content">
        <!-- <div class="content m-b-sm">
            <div class="media-content">
                <span class="title is-2 main-price">${{price}}</span>
                <span class="title is-2">${{discountedPrice ? discountedPrice : ''}}</span>
            </div>
        </div> -->
        <!-- <a :href="navigateTo" target="_" class="button is-fullwidth is-large is-danger is-outlined m-b-sm">
            Enroll on Udemy
        </a> -->
        <div class="field has-addons is-justify-content-center">
            <p class="control">
                <a target="_" href="http://impss.in/index.html" class="button is-danger is-outlined">
                    <span class="icon is-small">
                        <i class="fas fa-globe"></i>
                    </span>
                    <span>Project</span>
                </a>
            </p>
            <p class="control">
                <a href="" class="button is-danger is-outlined">
                    <span>Github</span>
                    <span class="icon is-small">
                        <i class="fab fa-github"></i>
                    </span>
                </a>
            </p>
        </div>
        <!-- <div class="content">
            <div class="m-b-none course-features">Course Requirements</div>
            <ul class="m-t-none">
                <li v-for="req in requirements" :key="req.value">
                    {{req.value}}
                </li>
            </ul>
        </div> -->
    </div>
</div>
</template>

<script>
export default {
    props: {
        requirements: {
            type: Array,
            default: null
        },
        price: {
            type: Number,
            default: null
        },
        navigateTo: {
            type: String,
            default: ''
        },
        discountedPrice: {
            type: Number,
            // required: true
        },
        image: {
            type: String,
            required: false
        }
    }
}
</script>

<style lang="scss" scoped>
figure.image {
  height: 150px;
  overflow: hidden;
  img {
    object-fit: contain;
    height: 100%;
  }
}
.card {
    z-index: 9999;
    /* min-width: 300px; */
    /* width: 75%; */
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 0 1px 1px rgba(20, 23, 28, .1), 0 3px 1px 0 rgba(20, 23, 28, .1);

    .title {
        color: gray;
    }

    .subtitle {
        color: gray;
    }

    .course-features {
        font-size: 17px;
    }

    .main-price {
        font-size: 17px;
        color: #7d7d7d;
        text-decoration: line-through;
    }
    @media screen and (min-width: 600px){
      /* min-width: 300px; */
      /* width: 75%; */
      /* max-width: 380px; */
    }
}
</style>
