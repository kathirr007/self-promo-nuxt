// export const state = () => {
//     return {
//         items: [],
//     }
// }

export const state = () => ({
    items: []
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
    }
}