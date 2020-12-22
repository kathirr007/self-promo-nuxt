<template>
  <div>
    <instructor-header title="Manage your Categories here">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <nuxt-link to="/instructor/category/create" class="button is-light">New Category</nuxt-link>
          <nuxt-link to="/" class="button is-danger is-inverted is-outlined">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span class>FrontEnd</span>
          </nuxt-link>
        </div>
      </template>
    </instructor-header>
    <div class="courses-page">
      <div class="container">
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <courseCreateStep1 @stepUpdated="mergeFormData" @fromCategories="createCategory" />
            <!-- <div class="field create-category-group has-addons">
              <div class="control">
                <input class="input is-large" type="text" placeholder="Find a repository">
              </div>
              <div class="control">
                <a class="button is-success is-large" :disabled="$route.path.includes('categories') && canProceed">
                  Search
                </a>
              </div>
            </div>-->
            <h1 class="courses-page-title">Available Categories</h1>
            <!-- Iterate Courses -->
            <!-- <div class="categories-list list is-hoverable"> -->
            <transition-group tag="div" name="slideDown" class="categories-list list is-hoverable">
              <span class="list-item" v-for="(category, i) in categories" :key="category._id">
                {{i+1}}. {{category.name}}
                <span class="tags is-pulled-right">
                  <nuxt-link
                    class="tag is-info"
                    :to="`/instructor/category/${category._id}`"
                    variant="info"
                  >Update</nuxt-link>
                  <!-- <span class="tag is-info">Update</span> -->
                  <span
                    class="tag is-danger"
                    @click="confirmDelete($event, 'category', category)"
                  >Delete</span>
                </span>
              </span>
            </transition-group>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import courseCreateStep1 from "~/components/instructor/courseCreateStep1";
import instructorHeader from "~/components/shared/Header";
import confirmDelete from "~/mixins/confirmDelete";
export default {
  // middleware: 'admin',
  layout: "instructor",
  components: {
    instructorHeader,
    courseCreateStep1,
  },
  mixins: [confirmDelete],
  computed: {
    categories() {
      return this.$store.state.instructor.category.items;
    },
  },

  async fetch({ store }) {
    await store.dispatch("instructor/category/fetchInstructorCategories");
  },
  data() {
    return {
      canProceed: false,
      form: {
        title: "",
        // category: ''
      },
    };
  },
  methods: {
    mergeFormData({ data, isValid }) {
      // debugger
      this.form = { ...this.form, ...data };
      this.canProceed = isValid;
    },

    createCategory() {
      // console.log(this.form)
      // debugger
      this.$store
        .dispatch("instructor/category/createCategory2", {
          name: this.form.title,
        })
        .then((category) => {
          // debugger
          this.$toasted.success(
            `The category <strong style="margin: 0 10px; display: inline-block;"> ${this.form.title} </strong> has been created successfully..`,
            { duration: 3500 }
          );
          document.querySelector(".pos-rel input").focus();
        });
    },
  },
};
</script>
<style scoped lang="scss">
.create-category-group {
  justify-content: center;
}
.tile-image {
  float: left;
}

.price-title {
  font-size: 40px;
  font-weight: bold;
}

.flex-centered {
  align-items: center;
  justify-content: flex-end;
  display: flex;
}

.tile-overlay-container {
  position: relative;

  &:hover {
    box-shadow: none;
  }

  &:hover > .tile-overlay {
    background-color: rgba(255, 255, 255, 0.9);
  }

  &:hover .tile-overlay-text {
    visibility: visible;
  }

  .tile-overlay {
    position: absolute;
    display: block;
    height: auto;
    bottom: 0;
    width: auto;
    right: 0;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;

    &-text {
      color: #58529f;
      visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 18px;
      white-space: pre-wrap;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 700;
      white-space: nowrap;
    }
  }
}

.courses-page {
  padding-top: 60px;

  &-title {
    font-size: 40px;
    font-weight: bold;
    padding-bottom: 20px;
  }

  .tag {
    text-transform: capitalize;
  }
}

.categories-list {
  &.list {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);

    .list-item {
      display: block;
      padding: 0.5em 1em;

      .tag {
        opacity: 0;
        transform: scale(1, 0);
        transform-origin: center bottom;
        // height: 0;
        cursor: pointer;
        transition: all 0.25s ease-in;
      }

      &:not(a) {
        color: #4a4a4a;
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #dbdbdb;
      }

      &:hover {
        .tag {
          opacity: 1;
          text-decoration: none;
          // height: auto;
          transform: scale(1, 1);
        }
      }
    }
  }
}
</style>