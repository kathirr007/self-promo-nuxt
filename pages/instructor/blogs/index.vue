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
                    v-for="(dblog,i) in drafts" :key="dblog._id"
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
                        @optionChanged="handleCommand($event, dblog)" :ref="`dropDown${i}`"
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
    <client-only>
      <v-dialog ref="confirmDialog" :pivotY="0.5" />
    </client-only>
    <!-- <client-only>
      <modal name="confirm-dialog" @before-open="beforeOpen">
        <div class="vc-container"><span class="vc-text-grid">
                <h4 class="vc-title">Confirm</h4>
                <p class="vc-text">Are you sure? Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    will be remove?</p>
            </span>
            <div class="vc-btn-grid">
              <button @click="closeConfirm" class="vc-btn left">No</button>
              <button @click="deleteBlog(blog)" class="vc-btn">Yes</button>
            </div>
        </div>
      </modal>
    </client-only> -->
  </div>
</template>
<script>
  import Header from '~/components/shared/Header'
  import Dropdown from '~/components/shared/Dropdown'
  // import VueConfirmDialog from "vue-confirm-dialog";
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
      Dropdown,
      // VueConfirmDialog
    },
    data() {
      return {
        activeTab: 0,
        confirmDelete: false,
        activeBlog: null
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
        // e.stopImmediatePropagation()
        // $event.stopImmediatePropagation()
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
      beforeOpen (event) {
        console.log(event.params.blog);
        this.$emit('modalOpen', event.params.blog)
      },
      closeConfirm(event) {
        console.log(event);
        this.$modal.hide('confirm-dialog')
      },
      displayDeleteWarning(blog,i) {

        console.log('Cliked on Draft title...')
        console.log(blog)
        this.activeBlog = blog
        // this.$modal.show('confirm-dialog', {blog: blog})
        this.$modal.show('dialog', {
          title: 'Please confirm',
          text: 'Do you want to delete?',
          blog: blog,
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
              handler: (blog) => {
                // alert('LIKE LIKE LIKE')
                this.$modal.hide('dialog')
                this.confirmDelete = true
                this.deleteBlog(this.activeBlog)
                // this.$refs.dropDown[i].closeDropdown()
              }
            }
          ]
        })
      },
      deleteBlog(blog) {
        console.log('Dispatching delete...')
        // debugger
        this.confirmDelete &&
          this.$store.dispatch('instructor/blog/deleteBlog', blog)
            .then(_ => this.$toasted.success('Blog was deleted successfully..', {duration: 3000}))
      },
      displayBlogTitle(blog) {
        return blog.title || blog.subtitle || 'Blog without title or subtitle :('
      },
      showTest() {
        this.$modal.show('hello-world');
      },
      showConfirm() {

      },
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

<style lang="scss">
  // .vm--modal {
  //   /* width: 0 !important;
  //   height: 0 !important; */
  //   box-shadow: none !important;
  //   background: none !important;
  // }
  .vc-title {
    color: black !important;
    padding: 0 1rem !important;
    width: 100% !important;
    font-weight: 900 !important;
    text-align: center !important;
    font-size: 16px !important;
    line-height: initial !important;
    margin-bottom: 5px !important;
  }

  .vc-text {
    color: black !important;
    padding: 0 1rem !important;
    width: 100% !important;
    font-weight: 500 !important;
    text-align: center !important;
    font-size: 14px !important;
    line-height: initial !important;
  }

/*   .vc-overlay {
    background: rgba(0, 0, 0, 0.29);
    width: 100%;
    height: 100%;
    transition: all 0.1s ease-in;
    left: 0;
    top: 0;
    z-index: 999999999999;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: baseline;
  } */

  .vc-container {
    background: white;
    border-radius: 1rem;
    width: 286px;
    height: auto;
    display: grid;
    grid-template-rows: 1fr auto;
    box-shadow: rgba(0, 0, 0, 0.29) 0px 3px 8px 0px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .vc-text-grid {
    padding: 1rem;
  }

  .vc-btn-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 50px;
    border-radius: 0 0 1rem 1rem;
    overflow: hidden;
  }

  .vc-btn-grid.isMono {
    grid-template-columns: 1fr;
  }

  .vc-btn {
    border-radius: 0 0 1rem 0;
    color: cornflowerblue;
    background: white;
    border: 0;
    font-size: 1rem;
    border-top: 1px solid rgb(224, 224, 224);
    cursor: pointer;
    font-weight: 700;
    outline: none;
  }

  .vc-btn:hover {
    background: whitesmoke;
  }

  .vc-btn:disabled {
    background: whitesmoke;
  }

  .vc-btn:active {
    box-shadow: inset 0 2px 0px 0px #00000014;
  }

  .vc-btn.left {
    border-radius: 0;
    /* color: black; */
    border-right: 1px solid #e0e0e0;
  }

  .vc-input[type="password"] {
    width: 100%;
    outline: none;
    border-radius: 8px;
    height: 35px;
    border: 0;
    margin: 5px 0;
    background-color: #ebebeb;
    padding: 0 0.5rem;
    font-size: 16px;
    transition: 0.21s ease;
  }

  .vc-input[type="password"]:hover,
  .vc-input[type="password"]:focus {
    background-color: #dfdfdf;
  }
</style>