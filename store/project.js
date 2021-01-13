// export const state = () => {
//     return {
//         items: [],
//     }
// }

export const state = () => ({
  items: [],
  item: {}
});

export const actions = {
  fetchCourses({ commit }) {
    // debugger
    return this.$axios.$get("/api/v1/products").then(projects => {
      // debugger
      commit(
        "setItems",
        { resource: "project", items: projects },
        { root: true }
      );
      return state.items;
    });
  },
  fetchCourseBySlug({ commit, state }, projectSlug) {
    // debugger
    return this.$axios
      .$get(`/api/v1/products/s/${projectSlug}`)
      .then(project => {
        // debugger
        commit("setCourse", project);
        return state.item;
      });
  }
};

export const mutations = {
  setCourse(state, project) {
    state.item = project;
  }
};
