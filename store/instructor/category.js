export const state = () => ({
  items: [],
  item: {},
  canUpdateCourse: false
})

export const actions = {
  fetchInstructorCategories({commit}) {
    return this.$axios.$get('/api/v1/categories')
      .then((categories) => {
        commit('setCategories', categories)
        return state.items
      })
      .catch(error => Promise.reject(error))
  },
  fetchCategoryById({commit, state}, categoryId) {
    return this.$axios.$get(`/api/v1/categories/${categoryId}`)
      .then((category) => {
        commit('setCategory', category)
        return state.item
      })
      .catch(error => Promise.reject(error))
  },
  createCategory(_, categoryData) {
    return this.$axios.$post('/api/v1/categories/', categoryData)
      .then(_ => this.$router.push('/instructor/categories'))
  },
  updateCategory({commit, state}) {
    const category = state.item
    return this.$axios.$patch(`/api/v1/categories/${category._id}`, category)
      .then(category => {
        commit('setCategory', category)
        return state.item
      })
      .catch(err => Promise.reject(err))
  },
  deleteCategory({commit, state}) {
    const category = state.item
    return this.$axios.$delete(`/api/v1/categories/${category._id}`, category)
      .then(category => {
        commit('setCategory', category)
        return state.item
      })
      .catch(err => Promise.reject(err))
  },
/*   updateLine({commit}, {index, value, field}) {
    commit('setLineValue', {index, value, field})
    commit('setCanUpdateCourse', true)
  },
  updateCourseValue({commit}, {value, field}) {
    commit('setCourseValue', {value, field})
    commit('setCanUpdateCourse', true)
  } */
}

export const mutations = {
  setCategories(state, categories) {
    state.items = categories
  },
  setCategory(state, category) {
    state.item = category
  },
  setCanUpdateCourse(state, canUpdate){
    state.canUpdateCourse = canUpdate
  },
  addLine(state, field) {
    state.item[field].push({value: ''})
  },
  removeLine(state, {field, index}) {
    state.item[field].splice(index, 1)
  },
  setLineValue(state, {index, value, field}){
    state.item[field][index].value = value
  },
  setCourseValue(state, {value, field}){
    state.item[field] = value
  }
}