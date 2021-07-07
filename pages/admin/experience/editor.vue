<template>
  <div>
    <Header title="Write your Experiences" exitLink="/admin/experiences" />
    <div class="experience-editor-container">
      <div class="container">
        <!-- Editor Component here! -->
        <editor @editorUpdated="saveExperience" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "~/components/shared/Header";
import Editor from "~/components/editor";
export default {
  layout: "admin",
  components: {
    Header,
    Editor
  },
  methods: {
    saveExperience(experienceData) {
      this.$store
        .dispatch("admin/experience/createExperience", experienceData)
        .then(experience =>
          this.$router.push(`/admin/experience/${experience._id}/edit`)
        );
    }
  }
};
</script>
<style lang="scss">
.experience-editor-container {
  padding-top: 60px;
}
</style>
