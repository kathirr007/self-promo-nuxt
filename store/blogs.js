import Vue from 'vue'

export const state = () => ({
  items: {
    all: [],
    featured: [],
    drafts: [],
    published: [],
  },
  item: {},
  pagination: {
    count: 0, // Count of all of our published blogs
    pageCount: 0, // How many pages we want to display
    pageSize: 5, // How many items we want to display per page
    pageNum: 1  // Current page
  }
})

export const actions = {
  // /api/v1/blogs?pageNum=1&pageSize=2
  fetchBlogs({commit, state}, filter) {
    const url = this.$applyParamsToUrl('/api/v1/blogs', filter)
    return this.$axios.$get(url)
      .then(data => {
        // debugger
        const { blogs, count, pageCount } = data
        commit('setBlogs', {resource: 'all', blogs})
        commit('setPagination', {count, pageCount})
        return state.items.all
      })
      .catch(err => Promise.reject(err))
  },
  // /api/v1/blogs?filter[featured]=true
  fetchFeaturedBlogs({commit, state}, filter) {
    // debugger
    const url = this.$applyParamsToUrl('/api/v1/blogs', filter)
    return this.$axios.$get(url)
      .then(data => {
        const { blogs } = data
        commit('setBlogs', {resource: 'featured', blogs})
        return state.items.featured
      })
      .catch(err => Promise.reject(err))
  },
  fetchBlogBySlug({commit, state}, slug) {
    return this.$axios.$get(`/api/v1/blogs/s/${slug}`)
      .then(blog => {
        commit('setBlog', blog)
        return state.item
      })
      .catch(err => Promise.reject(err))
  }
}

export const mutations = {
  setBlogs(state, {resource, blogs}) {
    state.items[resource] = blogs
  },
  setBlog(state, blog) {
    state.item = blog
  },
  setPage(state, currentPage) {
    Vue.set(state.pagination, 'pageNum', currentPage)
  },
  setPagination(state, {count, pageCount}) {
    Vue.set(state.pagination, 'count', count)
    Vue.set(state.pagination, 'pageCount', pageCount)
  }
}