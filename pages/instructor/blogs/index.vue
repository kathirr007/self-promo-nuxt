<template>
  <div>
    <Header title="Manage your Blogs" exitLink="/" />
    <div class="instructor-blogs">
      <div class="container">
        <div class="section">
          <div class="header-block">
            <h2>Your Stories</h2>
            <div class="title-menu">
              <button @click="$router.push('/instructor/blog/editor')" class="button">Write a story</button>
            </div>
          </div>
          <div class="tabs">
            <ul>
              <!-- set here activeTab -->
              <li @click="activeTab = 0">
                <a :class="{'is-active': activeTab === 0}">Drafts</a>
              </li>
              <!-- set here activeTab -->
              <li @click="activeTab = 1">
                <a :class="{'is-active': activeTab === 1}">Published</a>
              </li>
            </ul>
          </div>
          <div class="blogs-container">
            <!-- Draft blogs -->
            <!-- check for activeTab -->
            <template v-if="activeTab === 0">
              <div v-if="drafts && drafts.length > 0">
                <transition-group name="fade" mode="out-in">
                  <div
                    v-for="dblog in drafts" :key="dblog._id"
                    class="blog-card"
                  >
                    <!-- <h2>{{dblog.title}}</h2> -->
                    <h2>{{displayBlogTitle(dblog)}}</h2>
                    <div class="blog-card-footer">
                      <span>
                        Last Edited {{dblog.updatedAt | formatDate}}
                      </span>
                      <!-- Dropdown with menu here -->
                      <dropdown
                        @optionChanged="handleCommand($event, dblog)"
                        :items="draftsOptions"
                      />
                    </div>
                  </div>
                </transition-group>
              </div>
              <!-- In case of no drafts blogs  -->
              <div v-else class="blog-error">
                No Drafts :(
              </div>
            </template>
            <!-- Published blogs -->
            <!-- check for activeTab -->
            <template v-if="activeTab === 1">
              <div v-if="published && published.length > 0">
                <transition-group name="fade" mode="out-in">
                  <div
                    v-for="pblog in published"
                    :key="pblog._id"
                    :class="{'featured': pblog.featured}"
                    class="blog-card"
                  >
                    <!-- <h2>{{pblog.title}}</h2> -->
                    <h2>{{displayBlogTitle(pblog)}}</h2>
                    <div class="blog-card-footer">
                      <span>
                        Last Edited {{pblog.updatedAt | formatDate}}
                      </span>
                      <!-- Dropdown with menu here -->
                      <dropdown
                        @optionChanged="handleCommand($event, pblog)"
                        :items="publishedOptions(pblog.featured)"
                      />
                    </div>
                  </div>
                </transition-group>
              </div>
              <!-- In case of no drafts blogs  -->
              <div v-else class="blog-error">
                No Published :(
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '~/components/shared/Header'
  import Dropdown from '~/components/shared/Dropdown'
  import { mapState } from 'vuex'
  import {
    createPublishedOptions,
    createDraftsOptions,
    commands
  } from '~/pages/instructor/options'

  export default {
    // data with activeTab by default it will be 0
    // 0 represents drafts
    // 1 represents published
    layout: 'instructor',
    components: {
      Header,
      Dropdown
    },
    data() {
      return {
        activeTab: 0
      }
    },
    computed: {
      ...mapState({
        published: ({instructor}) => instructor.blog.items.published,
        drafts: ({instructor}) => instructor.blog.items.drafts
      }),
      /* publishedOptions() {
        return createPublishedOptions()
      }, */
      draftsOptions() {
        return createDraftsOptions()
      },
    },
    async fetch({store}) {
      await store.dispatch('instructor/blog/fetchUserBlogs')
    },
    methods: {
      handleCommand(command, blog) {
        if(command === commands.EDIT_BLOG) {
          console.log('Editing blog...')
          this.$router.push(`/instructor/blog/${blog._id}/edit`)
        }
        if(command === commands.DELETE_BLOG) {
          this.displayDeleteWarning(blog)
          console.log('Deleting blog...')
        }
        if(command === commands.TOGGLE_FEATURE) {
          this.updateBlog(blog)
          console.log('Updating blog...')
        }
      },
      updateBlog(blog) {
        const featured = !blog.featured
        const message = featured ? 'Blog has been added featured blogs...' : 'Blog has been removed from featured blogs...'
        this.$store.dispatch('instructor/blog/updatePublishedBlog', {id: blog._id, data: {featured}})
          .then(_ => {
            featured ? this.$toasted.success(message, {duration: 3000}) : this.$toasted.show(message, {duration: 3000})
          })
      },
      publishedOptions(isFeatured) {
        return createPublishedOptions(isFeatured)
      },
      displayDeleteWarning(blog) {
        const isConfirm = confirm('Are you sure you want to delete blog ?')

        if(isConfirm) {
          console.log('Dispatching delete...')
          this.$store.dispatch('instructor/blog/deleteBlog', blog)
            .then(_ => this.$toasted.success('Blog was deleted successfully..', {duration: 3000}))
        }
      },
      displayBlogTitle(blog) {
        return blog.title || blog.subtitle || 'Blog without title or subtitle :('
      }
    }
  }
</script>

<style scoped lang="scss">
  .is-active {
    border-bottom-color: #363636;
    color: #363636;
  }
  .blog-error {
    font-size: 35px;
  }

  .blog-card {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px 0;

    >h2 {
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

    >h2 {
      font-size: 40px;
      font-weight: bold;
    }

    .title-menu {
      margin-left: auto;
    }
  }
</style>