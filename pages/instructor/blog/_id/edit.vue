<template>
  <!-- Finish handling of URL -->
  <div>
    <Header title="Write your blog" exitLink="/instructor/blogs">
      <!-- TODO: Check if blog status is active -->
      <template #actionMenu v-if="blog.status === 'active'">
        <div class="full-page-takeover-header-button">
          <!-- TODO: Check blog validity before publishing -->
          <Modal
            @opened="checkBlogValidity"
            @submitted="updateBlogStatus($event, 'published')"
            openTitle="Publish"
            openBtnClass="button is-success  is-inverted is-outlined"
            title="Review Details"
          >
            <div>
              <div class="title">Once you publish blog you cannot change url to a blog.</div>
              <!-- Check for error -->
              <div v-if="!publishError">
                <div class="subtitle">This is how url to blog post will look like after publish:</div>
                <article class="message is-success">
                  <div class="message-body">
                    <!-- Get here actual slug -->
                    <strong>{{getCurrentUrl()}}/blogs/{{slug}}</strong>
                  </div>
                </article>
              </div>
              <article v-else class="message is-danger">
                <div class="message-body">
                  {{publishError}}
                </div>
              </article>
            </div>
          </Modal>
        </div>
      </template>
      <template v-else #actionMenu>
        <div class="full-page-takeover-header-button">
          <Modal
            @submitted="updateBlogStatus($event, 'active')"
            openTitle="Unpublish"
            openBtnClass="button is-success  is-inverted is-outlined"
            title="Unpublish Blog">
            <div>
              <div class="title">Unpublish blog so it's no longer displayed in blogs page</div>
            </div>
          </Modal>
        </div>
      </template>
    </Header>
    <div class="blog-editor-container">
      <div class="container">
        <editor
          @editorMounted="initBlogContent"
          @editorUpdated="updateBlog"
          :isSaving="isSaving"
          ref="editor"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import Editor from '~/components/editor'
  import Header from '~/components/shared/Header'
  import Modal from '~/components/shared/Modal'
  import { mapState } from 'vuex'
  import slugify from 'slugify'

  // Title: Blog post title
  // slug: blog-post-title

  // Slug is something like unique ID but in readable format

  export default {
    layout: 'instructor',
    components: {
      Editor,
      Header,
      Modal
    },
    data() {
      return {
        publishError: '',
        slug: ''
      }
    },
    computed: {
      ...mapState({
        blog: ({instructor}) => instructor.blog.item,
        isSaving: ({instructor}) => instructor.blog.isSaving,
      }),
      editor() {
        return this.$refs.editor
      }
    },
    async fetch({store, params}) {
      await store.dispatch('instructor/blog/fetchBlogById', params.id)
    },
    methods: {
      initBlogContent(editor) {
        if(this.blog && this.blog.content) {
          editor.setContent(this.blog.content)
        }
      },
      updateBlog(blogData) {
        if(!this.isSaving) {
          this.$store.dispatch('instructor/blog/updateBlog', {data: blogData, id: this.blog._id})
            .then(_ => this.$toasted.success('Blog is updated successfully..! :)', {duration: 3000}))
            .catch(err => this.$toasted.error('Cannot be update Blog.! :(', {duration: 3000}))
        }
      },
      updateBlogStatus({closeModal}, status) {
        const blogContent = this.editor.getContent()
        blogContent.status = status
        const message = status === 'published' ? 'Blog has been published..! :)' : 'Blog has been un-published..! :)'

        this.$store.dispatch('instructor/blog/updateBlog', {data: blogContent, id: this.blog._id})
          .then(_ => {
            this.$toasted.success(message, {duration: 3000})
            closeModal()
          })
          .catch(err => this.$toasted.error(message, {duration: 3000}))
      },
      publishBlog({closeModal}) {
        const blogContent = this.editor.getContent()
        blogContent.status = 'published'

        this.$store.dispatch('instructor/blog/updateBlog', {data: blogContent, id: this.blog._id})
          .then(_ => {
            this.$toasted.success('Blog has been published..! :)', {duration: 3000})
            closeModal()
          })
          .catch(err => this.$toasted.error('Blog cannot be published..! :(', {duration: 3000}))
      },
      unPublishBlog({closeModal}) {
        const blogContent = this.editor.getContent()
        blogContent.status = 'active'

        this.$store.dispatch('instructor/blog/updateBlog', {data: blogContent, id: this.blog._id})
          .then(_ => {
            this.$toasted.success('Blog has been un-published..! :)', {duration: 3000})
            closeModal()
          })
          .catch(err => this.$toasted.error('Blog cannot be published..! :(', {duration: 3000}))
      },
      checkBlogValidity() {
        const title = this.editor.getNodeValueByName('title')
        this.publishError = ''
        this.slug = ''

        if(title && title.length > 20) {
          // create slug from title
          this.slug = this.slugify(title)
        } else {
          this.publishError = 'Cannot publish! Title needs to be longer than 20 characters..!'
        }
      },
      slugify(text) {
        return slugify(text, {
          replacement: '-',
          remove: null,
          lower: true
        })
      },
      getCurrentUrl() {
        // process.client will return true if we are in browser environment
        return process.client && window.location.origin
      }
    }
  }
</script>