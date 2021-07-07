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
  fetchProjects({ commit }) {
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
  fetchProjectBySlug({ commit, state }, projectSlug) {
    return this.$axios
      .$get(`/api/v1/products/s/${projectSlug}`)
      .then(project => {
        // debugger
        commit("setProject", project);
        return state.item;
      });
  }
};

export const mutations = {
  setProject(state, project) {
    state.item = project;
  }
};
