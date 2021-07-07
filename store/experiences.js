import Vue from "vue";

export const state = () => ({
  items: {
    all: [],
    featured: [],
    drafts: [],
    published: []
  },
  item: {},
  pagination: {
    count: 0, // Count of all of our published experiences
    pageCount: 0, // How many pages we want to display
    pageSize: 5, // How many items we want to display per page
    pageNum: 1 // Current page
  }
});

export const actions = {
  // /api/v1/experiences?pageNum=1&pageSize=2
  fetchExperiences({ commit, state }, filter) {
    const url = this.$applyParamsToUrl("/api/v1/experiences", filter);
    return this.$axios
      .$get(url)
      .then(data => {
        // debugger
        const { experiences, count, pageCount } = data;
        commit("setExperiences", { resource: "all", experiences });
        commit("setPagination", { count, pageCount });
        return state.items.all;
      })
      .catch(err => Promise.reject(err));
  },
  // /api/v1/experiences?filter[featured]=true
  fetchFeaturedExperiences({ commit, state }, filter) {
    // debugger
    const url = this.$applyParamsToUrl("/api/v1/experiences", filter);
    return this.$axios
      .$get(url)
      .then(data => {
        const { experiences } = data;
        commit("setExperiences", { resource: "featured", experiences });
        return state.items.featured;
      })
      .catch(err => Promise.reject(err));
  },
  fetchExperienceBySlug({ commit, state }, slug) {
    // debugger
    return this.$axios
      .$get(`/api/v1/experiences/s/${slug}`)
      .then(experience => {
        // debugger
        commit("setExperience", experience);
        return state.item;
      })
      .catch(err => Promise.reject(err));
  },
  fetchExperienceById({ commit, state }, id) {
    return this.$axios
      .$get(`/api/v1/experiences/${id}`)
      .then(experience => {
        // debugger
        commit("setExperience", experience);
        return state.item;
      })
      .catch(err => Promise.reject(err));
  }
};

export const mutations = {
  setExperiences(state, { resource, experiences }) {
    state.items[resource] = experiences;
  },
  setExperience(state, experience) {
    // debugger
    state.item = experience;
  },
  setPage(state, currentPage) {
    Vue.set(state.pagination, "pageNum", currentPage);
  },
  setPagination(state, { count, pageCount }) {
    Vue.set(state.pagination, "count", count);
    Vue.set(state.pagination, "pageCount", pageCount);
  }
};
