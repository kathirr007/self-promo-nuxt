import Vue from "vue";

function seperateExperiences(experiences) {
  const published = [];
  const drafts = [];

  experiences.forEach(experience => {
    experience.status === "active"
      ? drafts.push(experience)
      : published.push(experience);

    /* if(experience.status === 'active') {

    } else if(experience.status === 'published') {

    } */
  });

  return { published, drafts };
}

export const state = () => ({
  items: {
    drafts: [],
    published: []
  },
  item: {},
  isSaving: false
});

export const actions = {
  createExperience(_, experienceData) {
    return this.$axios
      .$post("/api/v1/experiences", experienceData)
      .then(experience => experience)
      .catch(err => Promise.reject(err));
  },
  fetchExperienceById({ commit }, experienceId) {
    return this.$axios
      .$get(`/api/v1/experiences/${experienceId}`)
      .then(experience => commit("setExperience", experience));
  },
  fetchUserExperiences({ commit, state }) {
    return this.$axios.$get(`/api/v1/experiences/me`).then(experiences => {
      const { published, drafts } = seperateExperiences(experiences);
      commit("setExperiences", { resource: "drafts", items: drafts });
      commit("setExperiences", { resource: "published", items: published });

      return { published, drafts };
    });
  },
  updateExperience({ commit }, { data, id }) {
    commit("setIsSaving", true);
    return this.$axios
      .$patch(`/api/v1/experiences/${id}`, data)
      .then(experience => {
        commit("setExperience", experience);
        commit("setIsSaving", false);
        return state.item;
      })
      .catch(err => {
        commit("setIsSaving", false);
        return Promise.reject(err);
      });
  },
  updatePublishedExperience({ commit, state }, { id, data }) {
    console.log("Featuring the selected experience...");
    return this.$axios
      .$patch(`/api/v1/experiences/${id}`, data)
      .then(experience => {
        const index = state.items["published"].findIndex(b => b._id === id);
        commit("setPublishedExperience", { index, experience });
        return experience;
      })
      .catch(err => Promise.reject(err));
  },
  deleteExperience({ commit, state }, experience) {
    const resource = experience.status === "active" ? "drafts" : "published";
    // debugger
    return this.$axios
      .$delete(`/api/v1/experiences/${experience._id}`)
      .then(_ => {
        const experienceIndex = state.items[resource].findIndex(
          b => b._id === experience._id
        );
        commit("deleteExperience", { resource, experienceIndex });
        return true;
      })
      .catch(err => Promise.reject(err));
  }
};

export const mutations = {
  setExperience(state, experience) {
    state.item = experience;
  },
  setPublishedExperience(state, { index, experience }) {
    Vue.set(state.items.published, index, experience);
  },
  setExperiences(state, { resource, items }) {
    state.items[resource] = items;
  },
  setIsSaving(state, isSaving) {
    state.isSaving = isSaving;
  },
  deleteExperience(state, { resource, experienceIndex }) {
    state.items[resource].splice(experienceIndex, 1);
  }
};
