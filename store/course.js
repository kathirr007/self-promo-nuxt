// export const state = () => {
//     return {
//         items: [],
//     }
// }

export const state = () => ({
    items: [],
    item: {}
})

export const actions = {
    fetchCourses({commit}) {
        // debugger
        return this.$axios.$get('/api/v1/products')
            .then(courses => {
                // debugger
                commit('setItems', {resource: 'course', items: courses}, {root: true})
                return state.items
            })
    },
    fetchCourseBySlug({commit, state}, courseSlug) {
        // debugger
        return this.$axios.$get(`/api/v1/products/s/${courseSlug}`)
            .then(course => {
                // debugger
                commit('setCourse', course)
                return state.item
            })
    }
}

export const mutations = {
  setCourse(state, course) {
    state.item = course
  }
}