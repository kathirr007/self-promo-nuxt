<template>
  <div class="blog-editor-container">
    <div class="container">
      <!-- <div class="blog-section-user">
        <user-tile
          :name="blog.author.name"
          :avatar="blog.author.avatar"
          :date="blog.createdAt | formatDate"
        />
      </div> -->
      <editor-view :initialContent="blog.content" />
    </div>
  </div>
</template>

<script>
  // import { mapState } from 'vuex'
  import UserTile from '~/components/shared/UserTile'
  import EditorView from '~/components/editor/EditorView'

  export default {
    head() {
      return {
        title: this.blog.title,
        meta: [
          { hid: 'description', name: 'description', content: this.blog.subtitle }
        ]
      }
    },
    computed: {
      /* ...mapState({
        blog: state => state.experiences.item
      }), */
      blog() {
        return this.$store.state.experiences.item
      }
    },
    data() {
      return {
        // blog: null
      }
    },
    components: {
      UserTile,
      EditorView
    },
    async fetch({store, params}) {
      // console.log(params)
      await store.dispatch('experiences/fetchBlogBySlug', params.slug)
    },
    transition (to, from) {
      if (!from) { return 'slide-left' }
      return  'slide-right'
    },
  }
</script>

<style lang="scss" scoped>
  .blog-content, .blog-section-user {
    // max-width: 800px;
    margin: 10px auto;
  }
</style>