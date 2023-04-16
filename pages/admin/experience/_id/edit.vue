<template>
  <!-- Finish handling of URL -->
  <div>
    <Header title="Write your experience" exitLink="/admin/experiences">
      <!-- TODO: Check if experience status is active -->
      <template #actionMenu v-if="experience.status === 'active'">
        <div class="full-page-takeover-header-button">
          <!-- TODO: Check experience validity before publishing -->
          <Modal
            @opened="checkExperienceValidity"
            @submitted="updateExperienceStatus($event, 'published')"
            openTitle="Publish"
            openBtnClass="button is-success  is-inverted is-outlined"
            title="Review Details"
          >
            <div>
              <div class="title">
                Once you publish experience you cannot change url to a
                experience.
              </div>
              <!-- Check for error -->
              <div v-if="!publishError">
                <div class="subtitle">
                  This is how url to experience post will look like after
                  publish:
                </div>
                <article class="message is-success">
                  <div class="message-body">
                    <!-- Get here actual slug -->
                    <strong
                      >{{ getCurrentUrl() }}/experiences/{{ slug }}</strong
                    >
                  </div>
                </article>
              </div>
              <article v-else class="message is-danger">
                <div class="message-body">{{ publishError }}</div>
              </article>
            </div>
          </Modal>
        </div>
      </template>
      <template v-else #actionMenu>
        <div class="full-page-takeover-header-button">
          <Modal
            @submitted="updateExperienceStatus($event, 'active')"
            openTitle="Unpublish"
            openBtnClass="button is-success  is-inverted is-outlined"
            title="Unpublish Experience"
          >
            <div>
              <div class="title">
                Unpublish experience so it's no longer displayed in experiences
                page
              </div>
            </div>
          </Modal>
        </div>
      </template>
    </Header>
    <div class="experience-editor-container">
      <div class="container">
        <editor
          @editorMounted="initExperienceContent"
          @editorUpdated="updateExperience"
          :isSaving="isSaving"
          ref="editor"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Editor from "~/components/editor";
import Header from "~/components/shared/Header";
import Modal from "~/components/shared/Modal";
import { mapState } from "vuex";
import slugify from "slugify";

// Title: Experience post title
// slug: experience-post-title

// Slug is something like unique ID but in readable format

export default {
  layout: "admin",
  components: {
    Editor,
    Header,
    Modal,
  },
  data() {
    return {
      publishError: "",
      slug: "",
    };
  },
  computed: {
    ...mapState({
      experience: ({ admin }) => admin.experience.item,
      isSaving: ({ admin }) => admin.experience.isSaving,
    }),
    editor() {
      return this.$refs.editor;
    },
  },
  async fetch({ store, params }) {
    await store.dispatch("admin/experience/fetchExperienceById", params.id);
  },
  methods: {
    initExperienceContent(editor) {
      if (this.experience && this.experience.content) {
        editor.setContent(this.experience.content);
      }
    },
    updateExperience(experienceData) {
      if (!this.isSaving) {
        this.$store
          .dispatch("admin/experience/updateExperience", {
            data: experienceData,
            id: this.experience._id,
          })
          .then((_) =>
            this.$toasted.success("Experience is updated successfully..! :)", {
              duration: 3000,
            })
          )
          .catch((err) =>
            this.$toasted.error("Cannot be update Experience.! &#128530;", {
              duration: 3000,
            })
          );
      }
    },
    updateExperienceStatus({ closeModal }, status) {
      const experienceContent = this.editor.getContent();
      experienceContent.status = status;
      const message =
        status === "published"
          ? "Experience has been published..! :)"
          : "Experience has been un-published..! :)";

      this.$store
        .dispatch("admin/experience/updateExperience", {
          data: experienceContent,
          id: this.experience._id,
        })
        .then((_) => {
          this.$toasted.success(message, { duration: 3000 });
          closeModal();
          status === "published" && this.$router.push("/admin/experiences");
        })
        .catch((err) => this.$toasted.error(message, { duration: 3000 }));
    },
    publishExperience({ closeModal }) {
      const experienceContent = this.editor.getContent();
      experienceContent.status = "published";

      this.$store
        .dispatch("admin/experience/updateExperience", {
          data: experienceContent,
          id: this.experience._id,
        })
        .then((_) => {
          this.$toasted.success("Experience has been published..! :)", {
            duration: 3000,
          });
          closeModal();
          this.$router.push("/admin/experiences");
        })
        .catch((err) =>
          this.$toasted.error("Experience cannot be published..! &#128530;", {
            duration: 3000,
          })
        );
    },
    unPublishExperience({ closeModal }) {
      const experienceContent = this.editor.getContent();
      experienceContent.status = "active";

      this.$store
        .dispatch("admin/experience/updateExperience", {
          data: experienceContent,
          id: this.experience._id,
        })
        .then((_) => {
          this.$toasted.success("Experience has been un-published..! :)", {
            duration: 3000,
          });
          closeModal();
        })
        .catch((err) =>
          this.$toasted.error("Experience cannot be published..! &#128530;", {
            duration: 3000,
          })
        );
    },
    checkExperienceValidity() {
      const title = this.editor.getNodeValueByName("title");
      this.publishError = "";
      this.slug = "";

      if (title && title.length >= 10) {
        // create slug from title
        this.slug = this.slugify(title);
      } else {
        this.publishError =
          "Cannot publish! Title needs to be longer than 10 characters..!";
      }
    },
    slugify(text) {
      return slugify(text, {
        replacement: "-",
        remove: null,
        lower: true,
      });
    },
    getCurrentUrl() {
      // process.client will return true if we are in browser environment
      return process.client && window.location.origin;
    },
  },
};
</script>
