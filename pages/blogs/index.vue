<template>
  <div>
    <div class="main-content">
      <div class="container">
        <div class="columns is-mobile">
          <!-- posts -->
          <div class="column is-8">
            <!-- blog -->
            <!-- <transition-group appear name="slideDown" mode="out-in"> -->
            <div class="section" v-for="blog in publishedBlogs" :key="blog._id">
              <transition appear name="slideDown" mode="out-in">
              <div class="post">
                <div @click="$router.push(`/blogs/${blog.slug}`)" class="post-header clickable">
                  <!-- <h4 class="title is-4">{{blog.title}}</h4> -->
                  <h4 class="title is-4">{{displayBlogTitle(blog)}}</h4>
                  <h5 class="subtitle is-5">{{blog.subtitle}}</h5>
                </div>
                <div class="post-content">
                  by {{blog.author.name}}, {{blog.createdAt | formatDate}}
                </div>
              </div>
              </transition>
            </div>
            <!-- </transition-group> -->
            <!-- end of blog -->
            <!-- pagination -->
            <div v-if="pagination.pageCount && pagination.pageCount > 1" class="section">
              <client-only placeholder="Loading...">
                <paginate
                  v-model="currentPage"
                  :pageCount="pagination.pageCount"
                  :click-handler="fetchBlogs"
                  :prev-text="'Prev'"
                  :next-text="'Next'"
                  :container-class="'paginationContainer'"
                >

                </paginate>
              </client-only>
            </div>
            <!-- end of pagination -->
          </div>
          <!-- side bar -->
          <div class="column is-4 is-narrow">
            <!-- featured -->
            <div class="section">
              <div class="sidebar">
                <div class="sidebar-header">
                  <h4 class="title is-4">Featured Posts</h4>
                </div>
                <div class="sidebar-list">
                  <!-- Featured Blogs -->
                  <p
                    v-for="fblog in featuredBlogs"
                    :key="fblog._id"
                  >
                    <nuxt-link :to="`/blogs/${fblog.slug}`">{{fblog.title}}</nuxt-link>
                  </p>
                  <!-- Featured Blogs -->
                </div>
              </div>
            </div>
          </div>
          <!-- end of side bar -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'

  export default {
    computed: {
      ...mapState({
        publishedBlogs: state => state.blogs.items.all,
        featuredBlogs: state => state.blogs.items.featured,
        pagination: state => state.blogs.pagination,
      }),
      currentPage: {
        get() {
          // debugger
          return this.$store.state.blogs.pagination.pageNum
        },
        set(value) {
          // debugger
          this.$store.commit('blogs/setPage', value)
        }
      }
    },
    async fetch({ store, query }) {
      const filter = {}
      const {pageNum, pageSize} = query

      if(pageNum && pageSize) {
        filter.pageNum = parseInt(pageNum, 10)
        filter.pageSize = parseInt(pageSize, 10)

        store.commit('blogs/setPage', filter.pageNum)
      } else {
        filter.pageNum = 1
        filter.pageSize = 5
      }

      await store.dispatch('blogs/fetchBlogs', filter)
      await store.dispatch('blogs/fetchFeaturedBlogs', { 'filter[featured]': true })
    },
    methods: {
      displayBlogTitle(blog) {
        return blog.title || blog.subtitle || 'Blog without title or subtitle :('
      },
      setQueryPaginationParams() {
        const { pageSize, pageNum } = this.pagination
        this.$router.push({query: {pageNum, pageSize}})
      },
      fetchBlogs() {
        const filter = {}
        filter.pageNum = this.pagination.pageNum
        filter.pageSize = this.pagination.pageSize

        this.$store.dispatch('blogs/fetchBlogs', filter)
          .then(_ => this.setQueryPaginationParams())
        console.log('Pagination clicked..')
      }
    },
    mounted() {
      // this.$applyParamsToUrl('/testurl', {test01: 'TestValue'})
    }
  }
</script>
<style scoped lang="scss">
  .post-content {
    font-style: italic;
  }

  .pagination-content {
    display: flex;
    justify-content: flex-end;
  }

  .clickable {
    cursor: pointer;
  }

  #root {
    flex: 1 0 auto;
  }

  *:focus {
    outline: none;
  }

  a {
    transition: all .35s;
    color: #000;
  }

  .button:focus {
    border-color: #d74436;
    box-shadow: 0 0 0 0;
  }

  .input,
  .textarea {
    font-size: 1.1rem;
  }

  .input {
    &[type] {
      font-size: 1.1rem;
    }

    &:focus {
      border: 2px solid #d74436;
    }
  }

  .textarea:focus,
  .input[type]:focus {
    border: 2px solid #d74436;
  }

  /* this is used when inline-styled content
 overlaps text backgrounds in a really ugly way */

  .buffer {
    padding-bottom: 1.1rem;
  }

  /* navigation */

  .nav {
    background-color: #0d0c0d;
  }

  .nav-left {
    padding-left: 2rem;
  }

  .nav-right,
  .nav-center {
    padding-right: 2rem;
  }

  a.nav-item {
    &.is-tab {
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      color: #fff;
      padding: 0.4rem;
    }

    &:hover {
      color: #d74436;
    }

    &.is-tab:hover {
      border-bottom: 4px solid #d74436;
    }
  }

  /* main content */

  .main-content {
    padding: 4rem 0 2rem 0;
    min-height: 800px;

    .container {
      padding: 0 2rem 2rem 2rem;
    }
  }

  /* section */

  .section {
    padding: 0 0 2rem 0;
  }

  .section-header {
    padding-bottom: 3rem;

    .title {
      text-transform: uppercase;
      color: #4a4a4a;
      font-size: 1.3rem;
    }

    a {
      color: #d74436;
      font-weight: 700;

      &:hover {
        color: #e50076;
      }
    }
  }

  /* sidebar */

  .sidebar-header {
    border-color: #d74436;
    padding-bottom: 1rem;
    border-bottom: 4px solid #d74436;

    .title {
      font-weight: 700;
      text-transform: uppercase;
      font-size: 1.3rem;
    }
  }

  .sidebar-header-single .title {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.3rem;
  }

  .sidebar-list p,
  .sidebar-list-single p {
    font-size: 1.1rem;
    font-weight: 300;
    padding-bottom: 0.8rem;
  }

  .sidebar-list {
    a {
      color: #4a4a4a;
    }

    padding-top: 1.4rem;
  }

  .post-content,
  .sidebar-list-single {
    padding-top: 1.4rem;
  }

  .sidebar-list-nav {
    padding-top: 1rem;

    .is-tab {
      padding-right: 1rem;
    }
  }

  .sidebar-footer-single {
    padding-top: 2rem;

    a {
      color: #000;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 1.1rem;
      border-right: 4px solid #d74436;
      padding-right: 1rem;

      &:hover {
        color: #363636;
      }
    }
  }

  /* post */

  .post-header,
  .sidebar-header-single {
    border-color: #d74436;
    padding-left: 1rem;
    border-left: 4px solid #d74436;
  }

  .post-header {
    .title {
      font-weight: 700;
      font-size: 1.8rem;
      color: rgba(0, 0, 0, 0.84) !important;
      fill: rgba(0, 0, 0, 0.84) !important;
    }

    .subtitle {
      font-size: 1.1rem;
    }
  }

  .sidebar-header-single .subtitle {
    font-size: 1.1rem;
  }

  .post-content p,
  .post-single-content p {
    margin-bottom: 0.8rem;
  }

  .post-content {
    font-size: 1.1rem;
    font-weight: 300;
  }

  .post-single-content {
    font-size: 1.1rem;
    font-weight: 300;

    form {
      p:nth-child(even) {
        border-right: 0;
      }

      label {
        text-transform: uppercase;
        color: #4a4a4a;
        padding-bottom: 0.2rem;
      }

      .input[type] {
        padding-top: 0.2rem;
      }
    }

    p:nth-child(even) {
      border-right: 4px solid #d74436;
      padding-right: 1rem;
    }
  }

  /* override */

  .post-content a {
    color: #d74436;
  }

  .card-content-form form {
    padding-top: 1.5rem;
  }

  .post-footer {
    padding: 1.5rem 0 0 0;
  }

  /* pagination */

  .pagination-content {
    border-right: 4px solid #d74436;
    padding-right: 1rem;
  }

  .pagination-link.is-current {
    background-color: #d74436;
    border-color: #d74436;
  }
</style>