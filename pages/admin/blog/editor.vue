<template>
  <div>
    <Header title="Write your Blogs" exitLink="/admin/blogs" />
    <div class="blog-editor-container">
      <div class="container">
        <!-- Editor Component here! -->
        <editor @editorUpdated="saveBlog" />
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
    Editor,
  },
  methods: {
    saveBlog(blogData) {
      this.$store
        .dispatch("admin/blog/createBlog", blogData)
        .then((blog) => this.$router.push(`/admin/blog/${blog._id}/edit`));
    },
  },
};
</script>
<style lang="scss">
.blog-editor-container {
  padding-top: 60px;
}
</style>