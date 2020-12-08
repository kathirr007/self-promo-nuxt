const slugify = require('slugify');

export const state = () => ({
  items: [],
  item: {},
  canUpdateCourse: false
})

export const actions = {
  fetchInstructorCourses({commit}) {
    return this.$axios.$get('/api/v1/products/user-products')
      .then((courses) => {
        commit('setCourses', courses)
        return state.items
      })
      .catch(error => Promise.reject(error))
  },
  fetchCourseById({commit, state}, courseId) {
    return this.$axios.$get(`/api/v1/products/${courseId}`)
      .then((course) => {
        commit('setCourse', course)
        return state.item
      })
      .catch(error => Promise.reject(error))
  },
  createCourse(_, courseData) {
    return this.$axios.$post('/api/v1/products/', courseData)
      .then(_ => this.$router.push('/instructor/courses'))
  },
  updateCourse({commit, state}) {
    const course = state.item
    let storageLocation = `projects/${slugify(course.title, {
      replacement: '-',    // replace spaces with replacement
      remove: null,        // regex to remove characters
      lower: true          // result in lower case
    })}`;
    let data = new FormData()
    debugger
    if (course.images[0] != undefined && typeof course.images[0]['location'] == "undefined" ) {
        for(let i=0; i<course.images.length; i++) {
          // debugger
          data.append('images', course.images[i])
        }
    } else {
      data.append('images', JSON.stringify(course.images))
    }

    data.append('authorID', course.author)
    data.append('categoryID', course.category)
    data.append('createdAt', course.createdAt)
    data.append('description', course.description)
    data.append('promoVideoLink', course.promoVideoLink)
    data.append('productLink', course.productLink)
    data.append('requirements', JSON.stringify(course.requirements))
    // data.append('slug', course.slug)
    data.append('status', course.status)
    data.append('subtitle', course.subtitle)
    data.append('title', course.title)
    data.append('storageLocation', storageLocation)
    data.append('updatedAt', course.updatedAt)
    data.append('wsl', JSON.stringify(course.wsl))

    // course.data = data

    // debugger

    return this.$axios.$patch(`/api/v1/products/${course._id}`, data)
      .then(course => {
        commit('setCourse', course)
        return state.item
      })
      .catch(err => Promise.reject(err))
  },
  deleteCourseImage({commit, state}, params) {
    // const resource = course.status === 'active' ? 'drafts' : 'published'
    debugger
    return this.$axios.$delete(`/api/v1/products/ProdImage/${params.key}`)
      .then(_ => {
        // const courseIndex = state.items.findIndex((b) => b._id === course._id)
        return true
      })
      .catch(err => Promise.reject(err))
  },
  deleteCourse({commit, state}, course) {
    // const resource = course.status === 'active' ? 'drafts' : 'published'
    // debugger
    return this.$axios.$delete(`/api/v1/products/${course._id}`)
      .then(_ => {
        const courseIndex = state.items.findIndex((b) => b._id === course._id)
        commit('deleteCourse', {courseIndex})
        return true
      })
      .catch(err => Promise.reject(err))
  },
  updateLine({commit}, {index, value, field}) {
    commit('setLineValue', {index, value, field})
    commit('setCanUpdateCourse', true)
  },
  updateCourseValue({commit}, {value, field}) {
    commit('setCourseValue', {value, field})
    commit('setCanUpdateCourse', true)
  },
  updateCourseImage({commit}, {index, field}) {
    commit('removeCourseImage', {index, field})
    commit('setCanUpdateCourse', true)
  },
  updateCanUpdate({commit}) {
    commit('setCanUpdateCourse', true)
  }
}

export const mutations = {
  setCourses(state, courses) {
    state.items = courses
  },
  setCourse(state, course) {
    state.item = course
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
  removeCourseImage(state, {field, index}) {
    debugger
    state.item[field].splice(index, 1)
  },
  setLineValue(state, {index, value, field}){
    state.item[field][index].value = value
  },
  setCourseValue(state, {value, field}){
    state.item[field] = value
  },
  deleteCourse(state, {courseIndex}) {
    state.items.splice(courseIndex, 1)
  }
}