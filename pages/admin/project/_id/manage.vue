<template>
  <div class="manage-page">
    <Header title="Some very nice project name" exitLink="/admin/projects">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <button
            :disabled="!canUpdateProject"
            @click="updateProject"
            @keyup.enter="updateProject"
            class="button is-primary is-inverted is-outlined"
          >
            Save
          </button>
        </div>
        <div class="full-page-takeover-header-button">
          <Modal
            openTitle="Favorite"
            openBtnClass="button is-primary is-inverted is-outlined"
            title="Make Project Hero"
            @opened="applyProjectValues"
            @submitted="createProjectHero"
          >
            <div>
              <form>
                <div class="field">
                  <label class="label">Hero title</label>
                  <span class="label-info">Suggested 64 Characters</span>
                  <div class="control">
                    <input
                      v-model="projectHero.title"
                      class="input is-medium"
                      type="text"
                      placeholder="Amazing project discount"
                    />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Hero subtitle</label>
                  <span class="label-info">Suggested 128 Characters</span>
                  <input
                    v-model="projectHero.subtitle"
                    class="input is-medium"
                    type="text"
                    placeholder="Get all of the project for 9.99$"
                  />
                </div>
                <div class="field">
                  <label class="label">Hero image</label>
                  <span class="label-info"
                    >Image in format 3 by 1 (720 x 240)</span
                  >
                  <input
                    v-model="projectHero.image"
                    class="input is-medium"
                    type="text"
                    placeholder="Some image in format 3 by 1 (720 x 240)"
                  />
                  <figure class="image project-image is-3by1">
                    <img :src="projectHero.image" />
                  </figure>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </template>
    </Header>

    <div class="project-manage">
      <div class="container">
        <div class="columns">
          <div class="column is-3 p-lg">
            <!-- <aside class="menu is-hidden-mobile"> -->
            <aside class="menu">
              <p class="menu-label">Project Editing</p>
              <ul class="menu-list">
                <li>
                  <!-- display TechnologiesUsed -->
                  <a
                    @click.prevent="navigateTo(1)"
                    @keyup.enter.prevent="navigateTo(1)"
                    :class="activeComponentClass(1)"
                    >Target Technologies</a
                  >
                </li>
                <li>
                  <!-- display LandingPage -->
                  <a
                    @click.prevent="navigateTo(2)"
                    @keyup.enter.prevent="navigateTo(2)"
                    :class="activeComponentClass(2)"
                    >Project Landing Page</a
                  >
                </li>
              </ul>
              <p class="menu-label">Project Managment</p>
              <ul class="menu-list">
                <!-- display Price -->
                <!-- <li>
                  <a @click.prevent="navigateTo(3)"  :class="activeComponentClass(3)">
                    Price
                  </a>
                </li>-->
                <!-- display Status -->
                <li>
                  <a
                    @click.prevent="navigateTo(4)"
                    @keyup.enter.prevent="navigateTo(4)"
                    :class="activeComponentClass(4)"
                    >Status</a
                  >
                </li>
              </ul>
            </aside>
          </div>
          <div class="column">
            <keep-alive>
              <transition name="slideUp" mode="out-in">
                <component
                  :is="activeComponent"
                  :project="project"
                  @projectImageUpdated="handleProjectImageUpdate"
                  @projectImagesUpdated="handleProjectImagesUpdate"
                  @projectValueUpdated="handleProjectUpdate"
                />
                <!-- <target-students />
                <landing-page />
                <price />
                <status />-->
              </transition>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "~/components/shared/Modal";
import Header from "~/components/shared/Header";
import TechnologiesUsed from "~/components/admin/TechnologiesUsed";
import LandingPage from "~/components/admin/LandingPage";
import Price from "~/components/admin/Price";
import Status from "~/components/admin/Status";
import MultiComponentMixin from "~/mixins/MultiComponentMixin";
import { mapState } from "vuex";
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
  layout: "admin",
  components: {
    Header,
    TechnologiesUsed,
    LandingPage,
    Price,
    Status,
    Modal
  },
  mixins: [MultiComponentMixin],
  data() {
    return {
      steps: ["TechnologiesUsed", "LandingPage", "Price", "Status"],
      projectHero: {},
      isFormValid: false
    };
  },
  async fetch({ store, params }) {
    await store.dispatch("admin/project/fetchProjectById", params.id);
    await store.dispatch("category/fetchCategories");
  },
  computed: {
    ...mapState({
      project: state => state.admin.project.item,
      canUpdateProject: state => state.admin.project.canUpdateProject
    })
    /* isFormValid() {
        return false
      } */
  },
  methods: {
    handleProjectImageUpdate({ index, field, formValid }) {
      this.isFormValid = formValid;
      this.$store.dispatch("admin/project/updateProjectImage", {
        index,
        field,
        formValid
      });
    },
    handleProjectImagesUpdate({ oldValue, value, field }) {
      this.isFormValid = formValid;
      this.$store.dispatch("admin/project/updateProjectImage", {
        index,
        field,
        formValid
      });
    },
    handleProjectUpdate({ value, field, formValid }) {
      // debugger;
      // this.isFormValid = formValid
      this.$store.dispatch("admin/project/updateProjectValue", {
        field,
        value,
        formValid
      });
    },
    updateProject() {
      this.$store
        .dispatch("admin/project/updateProject")
        .then(_ =>
          this.$toasted.success("Project has been successfully updated..!", {
            duration: 3000
          })
        )
        .catch(err => {
          debugger;
          this.$toasted.error("Project cannot be updated! :)", {
            duration: 3000
          });
        });
    },
    createProjectHero({ closeModal }) {
      // debugger
      const heroData = { ...this.projectHero };
      heroData.product = { ...this.project };
      this.$store.dispatch("heroes/createHero", heroData).then(() => {
        closeModal();
        this.$toasted.success("Project Hero was created...!", {
          duration: 3000
        });
      });
    },
    applyProjectValues() {
      // this.projectHero.title = this.project.title
      // this.projectHero.subtitle = this.project.subtitle
      // this.projectHero.image = this.project.image

      !this.projectHero.title &&
        this.$set(this.projectHero, "title", this.project.title);
      !this.projectHero.subtitle &&
        this.$set(this.projectHero, "subtitle", this.project.subtitle);
      !this.projectHero.image &&
        this.$set(this.projectHero, "image", this.project.image);
    }
  }
};
</script>

<style lang="scss">
.manage-page {
  .label-info {
    font-size: 13px;
    color: gray;
    font-style: italic;
  }

  .project-manage {
    padding-top: 40px;

    .menu {
      padding-top: 30px;

      &-label {
        font-size: 20px;
        color: black;
      }

      &-list {
        > li {
          font-size: 18px;
          margin-top: 10px;

          > a {
            &.is-active {
              background-color: transparent;
              color: inherit;
              border-right: 3px solid #0a0548;
            }
          }
        }
      }
    }

    .card {
      &-section {
        padding: 20px;
      }

      &-header {
        &-title {
          padding: 0;
          color: #8f99a3;
          font-weight: 400;
          font-size: 25px;
        }
      }
    }

    .project-image {
      img {
        object-fit: cover;
      }
    }
  }
}
</style>
