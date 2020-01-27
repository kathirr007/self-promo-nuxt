import Vue from 'vue'

function seperateBlogs(blogs) {
  const published = []
  const drafts = []

  blogs.forEach(blog => {
    blog.status === 'active' ? drafts.push(blog) : published.push(blog)

    /* if(blog.status === 'active') {

    } else if(blog.status === 'published') {

    } */
  })

  return {published, drafts}
}

export const state = () => ({
  items: {
    drafts: [],
    published: [],
  },
  item : {},
  isSaving: false
})

export const actions = {
  createBlog(_, blogData) {
    return this.$axios.$post('/api/v1/blogs', blogData)
      .then(blog => blog)
      .catch(err => Promise.reject(err))
  },
  fetchBlogById({commit}, blogId) {
    return this.$axios.$get(`/api/v1/blogs/${blogId}`)
      .then(blog => commit('setBlog', blog))
  },
  fetchUserBlogs({commit, state}) {
    return this.$axios.$get(`/api/v1/blogs/me`)
      .then(blogs => {
        const { published, drafts } = seperateBlogs(blogs)
        commit('setBlogs', {resource: 'drafts', items : drafts})
        commit('setBlogs', {resource: 'published', items : published})

        return { published, drafts }
      })
  },
  updateBlog({commit}, {data, id}) {
    commit('setIsSaving', true)
    return this.$axios.$patch(`/api/v1/blogs/${id}`, data)
    .then(blog => {
        commit('setBlog', blog)
        commit('setIsSaving', false)
        return state.item
      })
      .catch(err => {
        commit('setIsSaving', false)
        return Promise.reject(err)
      })
  },
  updatePublishedBlog({commit, state}, {id, data}){
    console.log('Featuring the selected blog...')
    return this.$axios.$patch(`/api/v1/blogs/${id}`, data)
      .then(blog => {
        const index = state.items['published'].findIndex(b => b._id === id)
        commit('setPublishedBlog', {index, blog})
        return blog
      })
      .catch(err => Promise.reject(err))
  },
  deleteBlog({commit, state}, blog) {
    const resource = blog.status === 'active' ? 'drafts' : 'published'
    return this.$axios.$delete(`/api/v1/blogs/${blog._id}`)
      .then(_ => {
        const blogIndex = state.items[resource].findIndex((b) => b._id === blog._id)
        commit('deleteBlog', {resource, blogIndex})
        return true
      })
      .catch(err => Promise.reject(err))
  }
}

export const mutations = {
  setBlog(state, blog) {
    state.item = blog
  },
  setPublishedBlog(state, {index, blog}) {
    Vue.set(state.items.published, index, blog)
  },
  setBlogs(state, {resource, items}) {
    state.items[resource] = items
  },
  setIsSaving(state, isSaving) {
    state.isSaving = isSaving
  },
  deleteBlog(state, {resource, blogIndex}) {
    state.items[resource].splice(blogIndex, 1)
  }
}