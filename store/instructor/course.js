const slugify = require('slugify');

export const state = () => ({
  items: [],
  item: {
    'storageLocation': null
  },
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
  createCourse({commit, state}, courseData) {
    let storageLocation = `projects/${slugify(courseData.title, {
      replacement: '-',    // replace spaces with replacement
      remove: null,        // regex to remove characters
      lower: true          // result in lower case
    })}`;
    commit('setCourseValue', {value: courseData.title, field: 'title'})
    return this.$axios.$post('/api/v1/products/', courseData)
      .then(_ => this.$router.push('/instructor/courses'))
  },
  updateCourse({commit, state}) {
    const course = state.item
    // debugger
/*     let storageLocationOld = null
    let storageLocationNew
    storageLocationNew = `projects/${slugify(course.title, {
      replacement: '-',    // replace spaces with replacement
      remove: null,        // regex to remove characters
      lower: true          // result in lower case
    })}`;
    storageLocationNew === storageLocationOld ? storageLocationOld : storageLocationOld = storageLocationNew */
    let data = new FormData()
    let uploadedFiles = null
    let deleteFiles = false
    if (course.images[0] != undefined && typeof course.images[0]['location'] == "undefined" ) {
        for(let i=0; i<course.images.length; i++) {
          // debugger
          data.append('images', course.images[i])
          uploadedFiles = JSON.stringify(course.uploadedFiles)
          deleteFiles = true
        }
    } else {
      uploadedFiles = JSON.stringify(course.images)
      data.append('images', uploadedFiles)
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
    data.append('storageLocation', course.storageLocation)
    data.append('storageLocationNew', course.storageLocationNew)
    data.append('updatedAt', course.updatedAt)
    data.append('wsl', JSON.stringify(course.wsl))

    // course.data = data

    // debugger
    const headers = {'storagelocation': course.storageLocation, 'storagelocationnew': course.storageLocationNew, 'uploadedfiles': uploadedFiles, 'deletefiles': deleteFiles}

    return this.$axios.$patch(`/api/v1/products/${course._id}`, data, {headers: headers})
      .then(course => {
        commit('setCourse', course)
        return state.item
      })
      .catch(err => Promise.reject(err))
  },
  deleteCourseImage({commit, state}, params) {
    // const resource = course.status === 'active' ? 'drafts' : 'published'
    // debugger
    return this.$axios.$delete(`/api/v1/products/ProdImage/${params.key}`, {headers:{'storagelocation': params.s3Key}})
      .then(_ => {
        // const courseIndex = state.items.findIndex((b) => b._id === course._id)
        commit('setCanUpdateCourse', true)
        return true
      })
      .catch(err => Promise.reject(err))
  },
  deleteCourse({commit, state}, course) {
    // const resource = course.status === 'active' ? 'drafts' : 'published'
    // debugger
    const uploadedFiles = JSON.stringify(course.images)
    const headers = {'storagelocation': course.storageLocation, 'storagelocationnew': course.storageLocationNew, 'uploadedfiles': uploadedFiles, 'deletefiles': 'true'}
    return this.$axios.$delete(`/api/v1/products/${course._id}`, {headers: headers})
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
  updateCourseValue({commit}, {value, field, title}) {
    commit('setCourseValue', {value, field})
    if (field === 'title') {
      if(value && value.length >= 10) {
        // debugger
        commit('setCanUpdateCourse', true)
      } else {
        commit('setCanUpdateCourse', false)
      }
    } else {
      commit('setCanUpdateCourse', true)
    }
  },
  updateCourseImage({commit}, {index, field, title}) {
    commit('removeCourseImage', {index, field})
    /* if(title && title.length >= 10) {
      debugger
      commit('setCanUpdateCourse', true)
    } */
  },
  updateUploadedFiles({commit}, value) {
    // debugger
    commit('setUploadedFiles', value)
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
    // debugger
    state.item[field].splice(index, 1)
  },
  setLineValue(state, {index, value, field}){
    state.item[field][index].value = value
  },
  setCourseValue(state, {value, field}){
    if(field === 'title') {
      // debugger
      let storageLocationNew = `projects/${slugify(value, {
        replacement: '-',    // replace spaces with replacement
        remove: null,        // regex to remove characters
        lower: true          // result in lower case
      })}`;
      if (storageLocationNew !== state.item['storageLocation']) {
        state.item['storageLocation'] = storageLocationNew
        state.item['storageLocationNew'] = storageLocationNew
      }
    }
    state.item[field] = value
  },
  setUploadedFiles(state, value){
    // debugger
    state.item['uploadedFiles'] = value
  },
  deleteCourse(state, {courseIndex}) {
    state.items.splice(courseIndex, 1)
  }
}