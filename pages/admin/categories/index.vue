<template>
  <div>
    <admin-header title="Manage Categories">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <nuxt-link to="/admin/category/create" class="button is-light"
            >New Category</nuxt-link
          >
          <nuxt-link to="/" class="button is-danger is-inverted is-outlined">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span class>FrontEnd</span>
          </nuxt-link>
        </div>
      </template>
    </admin-header>
    <div class="projects-page">
      <div class="container">
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <projectCreateStep1
              @stepUpdated="mergeFormData"
              @fromCategories="createCategory"
            />
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
            <h1 class="projects-page-title">Available Categories</h1>
            <!-- Iterate Projects -->
            <!-- <div class="categories-list list is-hoverable"> -->
            <transition-group
              tag="ul"
              name="slideDown"
              role="list"
              class="categories-list list is-hoverable"
            >
              <li
                class="list-item"
                role="listitem"
                tabindex="0"
                v-click-outside="clearSelectedItem" :class="{'focused' : selectedItem && (selectedItem._id === category._id)}"
                v-for="(category, i) in categories"
                @keyup.tab="handleTabKey($event, category)"
                :key="category._id"

              >
                {{ i + 1 }}. {{ category.name }}
                <span class="tags is-pulled-right">
                  <nuxt-link
                    class="tag is-info"
                    :to="`/admin/category/${category._id}`"
                    variant="info"
                    role="button"
                    tabindex="0"
                    >Update</nuxt-link
                  >
                  <!-- <span class="tag is-info">Update</span> -->
                  <span
                    class="tag is-danger"
                    role="button"
                    tabindex="0"
                    @click="confirmDelete($event, 'category', category)"
                    @keyup.enter="confirmDelete($event, 'category', category)"
                    >Delete</span
                  >
                </span>
              </li>
            </transition-group>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import projectCreateStep1 from "~/components/admin/projectCreateStep1";
import adminHeader from "~/components/shared/Header";
import confirmDelete from "~/mixins/confirmDelete";
import ClickOutside from 'vue-click-outside'

export default {
  // middleware: 'admin',
  layout: "admin",
  components: {
    adminHeader,
    projectCreateStep1
  },
  directives: {
    ClickOutside
  },
  mixins: [confirmDelete],
  computed: {
    categories() {
      return this.$store.state.admin.category.items;
    }
  },

  async fetch({ store }) {
    await store.dispatch("admin/category/fetchadminCategories");
  },
  data() {
    return {
      canProceed: false,
      form: {
        title: ""
        // category: ''
      },
      selectedItem: null
    };
  },
  methods: {
    clearSelectedItem() {
      this.selectedItem = null;
    },
    handleTabKey(e, item) {
      if(this.selectedItem === null || this.selectedItem?._id !== item._id) {
        this.selectedItem = item
      }
    },
    mergeFormData({ data, isValid }) {
      // debugger
      this.form = { ...this.form, ...data };
      this.canProceed = isValid;
    },

    createCategory() {
      // console.log(this.form)
      // debugger
      this.$store
        .dispatch("admin/category/createCategory2", {
          name: this.form.title
        })
        .then(category => {
          // debugger
          this.$toasted.success(
            `The category <strong style="margin: 0 10px; display: inline-block;"> ${this.form.title} </strong> has been created successfully..`,
            { duration: 3500 }
          );
          document.querySelector(".pos-rel input").focus();
        });
    }
  }
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

.projects-page {
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

      &:not(.focused) .tag {
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
