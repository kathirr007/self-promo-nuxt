<template>
  <div>
    <Header title="Manage your Experiences">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <nuxt-link to="/admin/experience/editor" class="button is-light"
            >New</nuxt-link
          >
          <nuxt-link to="/" class="button is-danger is-inverted is-outlined">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span class>FrontEnd</span>
          </nuxt-link>
        </div>
      </template>
    </Header>
    <div class="admin-experiences">
      <div class="container">
        <div class="section">
          <div class="header-block">
            <h2 class="is-size-4-mobile">Your Experiences</h2>
            <div class="title-menu">
              <button
                @click="$router.push('/admin/experience/editor')"
                @keyup.enter="$router.push('/admin/experience/editor')"
                class="button"
              >
                Add New
                <span class="is-hidden-mobile ml-1">Experience</span>
              </button>
            </div>
          </div>
          <div class="tabs">
            <ul>
              <!-- set here activeTab -->
              <li @click="activeTab = 0" @keyup.enter="activeTab = 0">
                <a :class="{ 'is-active': activeTab === 0 }">Drafts</a>
              </li>
              <!-- set here activeTab -->
              <li @click="activeTab = 1" @keyup.enter="activeTab = 1">
                <a :class="{ 'is-active': activeTab === 1 }">Published</a>
              </li>
            </ul>
          </div>
          <div class="experiences-container">
            <!-- Draft experiences -->
            <!-- check for activeTab -->
            <template v-if="activeTab === 0">
              <div v-if="drafts && drafts.length > 0">
                <div
                  v-for="(experience, i) in drafts"
                  :key="experience._id"
                  class="experience-card"
                >
                  <!-- <h2>{{experience.title}}</h2> -->
                  <transition-group appear name="slideDown" mode="out-in">
                    <h2 :key="i + 1">
                      {{ displayExperienceTitle(experience) }}
                    </h2>
                    <div :key="i + 2" class="experience-card-footer">
                      <span
                        >Last Edited
                        {{ experience.updatedAt | formatDate }}</span
                      >
                      <!-- Dropdown with menu here -->
                      <dropdown
                        @optionChanged="handleCommand($event, experience)"
                        :ref="`dropDown${i}`"
                        :items="draftsOptions"
                      />
                    </div>
                  </transition-group>
                </div>
              </div>
              <!-- In case of no drafts experiences  -->
              <transition v-else appear name="slideDown" mode="out-in">
                <div class="experience-error">
                  No Drafts <i class="far fa-frown" style="color:#58529f"></i>
                </div>
              </transition>
            </template>
            <!-- Published experiences -->
            <!-- check for activeTab -->
            <template v-if="activeTab === 1">
              <div v-if="published && published.length > 0">
                <div
                  v-for="(pexperience, i) in published"
                  :key="pexperience._id"
                  :class="{ featured: pexperience.featured }"
                  class="experience-card"
                >
                  <transition-group appear name="slideDown" mode="out-in">
                    <h2 :key="i + 1">
                      {{ displayExperienceTitle(pexperience) }}
                    </h2>
                    <div :key="i + 2" class="experience-card-footer">
                      <span
                        >Last Edited
                        {{ pexperience.updatedAt | formatDate }}</span
                      >
                      <!-- Dropdown with menu here -->
                      <dropdown
                        @optionChanged="handleCommand($event, pexperience)"
                        :items="publishedOptions(pexperience.featured)"
                      />
                    </div>
                  </transition-group>
                </div>
              </div>
              <!-- In case of no drafts experiences  -->
              <transition v-else appear name="slideDown" mode="out-in">
                <div class="experience-error">
                  No Published
                  <i class="far fa-frown" style="color:#58529f"></i>
                </div>
              </transition>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- <client-only>
      <v-dialog ref="confirmDialog" :pivotY="0.5" />
    </client-only>-->
    <!-- <client-only>
      <modal name="confirm-dialog" @before-open="beforeOpen">
        <div class="vc-container"><span class="vc-text-grid">
                <h4 class="vc-title">Confirm</h4>
                <p class="vc-text">Are you sure? Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    will be remove?</p>
            </span>
            <div class="vc-btn-grid">
              <button @click="closeConfirm" class="vc-btn left">No</button>
              <button @click="deleteExperience(experience)" class="vc-btn">Yes</button>
            </div>
        </div>
      </modal>
    </client-only>-->
  </div>
</template>
<script>
import Header from "~/components/shared/Header";
import Dropdown from "~/components/shared/Dropdown";
// import VueConfirmDialog from "vue-confirm-dialog";
import { mapState } from "vuex";
import {
  createPublishedOptions,
  createDraftsOptions,
  commands
} from "~/pages/admin/options";

export default {
  // data with activeTab by default it will be 0
  // 0 represents drafts
  // 1 represents published
  layout: "admin",
  components: {
    Header,
    Dropdown
    // VueConfirmDialog
  },
  data() {
    return {
      activeTab: 0,
      confirmDelete: false,
      activeExperience: null
    };
  },
  computed: {
    ...mapState({
      published: ({ admin }) => admin.experience.items.published,
      drafts: ({ admin }) => admin.experience.items.drafts
    }),
    /* publishedOptions() {
        return createPublishedOptions()
      }, */
    draftsOptions() {
      return createDraftsOptions();
    }
  },
  async fetch({ store }) {
    await store.dispatch("admin/experience/fetchUserExperiences");
  },
  methods: {
    handleCommand(command, experience) {
      // e.stopImmediatePropagation()
      // $event.stopImmediatePropagation()
      if (command === commands.EDIT_EXPERIENCE) {
        console.log("Editing experience...");
        this.$router.push(`/admin/experience/${experience._id}/edit`);
      }
      if (command === commands.DELETE_EXPERIENCE) {
        this.displayDeleteWarning(experience);
        console.log("Deleting experience...");
      }
      if (command === commands.TOGGLE_FEATURE) {
        this.updateExperience(experience);
        console.log("Updating experience...");
      }
    },
    updateExperience(experience) {
      const featured = !experience.featured;
      const message = featured
        ? "Experience has been added featured experiences..."
        : "Experience has been removed from featured experiences...";
      this.$store
        .dispatch("admin/experience/updatePublishedExperience", {
          id: experience._id,
          data: { featured }
        })
        .then(_ => {
          featured
            ? this.$toasted.success(message, { duration: 3000 })
            : this.$toasted.show(message, { duration: 3000 });
        });
    },
    publishedOptions(isFeatured) {
      return createPublishedOptions(isFeatured);
    },
    beforeOpen(event) {
      console.log(event.params.experience);
      this.$emit("modalOpen", event.params.experience);
    },
    closeConfirm(event) {
      console.log(event);
      this.$modal.hide("confirm-dialog");
    },
    displayDeleteWarning(experience, i) {
      console.log("Cliked on Draft title...");
      console.log(experience);
      // this.activeExperience = experience

      let self = this;
      self.$vueConfirm.confirm(
        {
          auth: false,
          message: `Are you sure? <br> You want to delete <strong>${experience.title}</strong>`,
          button: {
            no: "No",
            yes: "Yes"
          }
        },
        function(confirm) {
          if (confirm == true) {
            // ... do some thing
            console.log("Dispatching delete...");
            // debugger
            self.$store
              .dispatch("admin/experience/deleteExperience", experience)
              .then(_ =>
                self.$toasted.success(
                  `The Experience <strong style="margin: 0 10px; display: inline-block;"> ${experience.title} </strong> was deleted successfully..`,
                  { duration: 3500 }
                )
              );
          }
        }
      );

      // this.$modal.show('confirm-dialog', {experience: experience})
      /* this.$modal.show('dialog', {
          title: 'Please confirm',
          text: 'Do you want to delete?',
          experience: experience,
          buttons: [
            {
              title: 'C💩NCEL',
              handler: (props) => {
                // console.log(this.$refs.confirmDialog)
                // debugger
                this.$modal.hide('dialog')
                // this.beforeClose()
                // this.$refs.dropDown[i].closeDropdown()
              }
            },
            {
              title: 'Yes',
              default: true,
              handler: (experience) => {
                // alert('LIKE LIKE LIKE')
                this.$modal.hide('dialog')
                this.confirmDelete = true
                this.deleteExperience(this.activeExperience)
                // this.$refs.dropDown[i].closeDropdown()
              }
            }
          ]
        }) */
    },
    deleteExperience(experience) {
      console.log("Dispatching delete...");
      // debugger
      this.confirmDelete &&
        this.$store
          .dispatch("admin/experience/deleteExperience", experience)
          .then(_ =>
            this.$toasted.success("Experience was deleted successfully..", {
              duration: 3000
            })
          );
    },
    displayExperienceTitle(experience) {
      return (
        experience.title ||
        experience.subtitle ||
        "Experience without title or subtitle :("
      );
    },
    showTest() {
      this.$modal.show("hello-world");
    },
    showConfirm() {}
  }
};
</script>

<style scoped lang="scss">
.admin-experiences {
  .tabs {
    margin-bottom: 0;
  }
}
.is-active {
  border-bottom-color: #363636;
  color: #363636;
}
.experience-error {
  font-size: 35px;
  padding-top: 20px;
}

.experience-card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 0;

  h2 {
    font-size: 30px;
    font-weight: bold;
  }

  &-footer {
    color: rgba(0, 0, 0, 0.54);
  }

  &.featured {
    border-left: 5px solid #3cc314;
    padding-left: 10px;
    transition: border ease-out 0.2s;
  }
}

.header-block {
  display: flex;
  flex-direction: row;
  align-items: center;

  > h2 {
    font-size: 40px;
    font-weight: bold;
  }

  .title-menu {
    margin-left: auto;
  }
}
</style>
