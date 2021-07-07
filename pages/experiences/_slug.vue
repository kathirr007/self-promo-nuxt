<template>
  <div class="experience-editor-container p-4" v-if="experience != null">
    <div class="container">
      <!-- <div class="experience-section-user">
        <user-tile
          :name="experience.author.name"
          :avatar="experience.author.avatar"
          :date="experience.createdAt | formatDate"
        />
      </div>-->
      <editor-view :initialContent="experience.content" />
    </div>
  </div>
  <div class="container" v-else>
    <ErrorView
      :title="`Ooooops, the page you are trying to access doesn't exist :(`"
      :status="'404'"
      :navigateToPage="'/'"
      :navigateToText="'Navigate back to Home Page'"
    />
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import UserTile from "~/components/shared/UserTile";
import EditorView from "~/components/editor/EditorView";
import ErrorView from "@/components/shared/ErrorView";

export default {
  head() {
    return {
      title: this.experience?.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.experience?.subtitle
        }
      ]
    };
  },
  computed: {
    /* ...mapState({
        experience: state => state.experiences.item
      }), */
    experience() {
      return this.$store.state.experiences.item;
    }
  },
  data() {
    return {
      // experience: null
    };
  },
  components: {
    ErrorView,
    UserTile,
    EditorView
  },
  async fetch({ store, params }) {
    // console.log(params)
    await store.dispatch("experiences/fetchExperienceBySlug", params.slug);
  },
  transition(to, from) {
    if (!from) {
      return "slide-left";
    }
    return "slide-right";
  }
};
</script>

<style lang="scss" scoped>
.experience-content,
.experience-section-user {
  // max-width: 800px;
  margin: 10px auto;
}
</style>
