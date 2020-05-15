export const state = () => ({
  items: []
})

export const getters = {
  hasCategories(state) {
    return state.items.length > 0
  }
}

export const actions = {
  fetchCategories({commit, state, getters}) {
    if (getters.hasCategories) return
    return this.$axios.$get('/api/v1/categories')
      .then(categories => {
        commit('setCategories', categories)
        return state.items
      })
      .catch(err => Promise.reject(err))
  }
}

export const mutations = {
  setCategories(state, categories) {
    state.items = categories
  }
}