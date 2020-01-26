export const state = () => ({
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
  }
}

export const mutations = {
  setBlog(state, blog) {
    state.item = blog
  },
  setIsSaving(state, isSaving) {
    state.isSaving = isSaving
  }
}