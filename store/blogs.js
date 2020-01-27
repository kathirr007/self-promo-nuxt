export const state = () => ({
  items: {
    all: [],
    featured: [],
    drafts: [],
    published: [],
  },
  item: {}
})

export const actions = {
  fetchBlogs({commit, state}) {
    return this.$axios.$get('/api/v1/blogs')
      .then(data => {
        const { blogs } = data
        commit('setBlogs', {resource: 'all', blogs})
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
  }
}