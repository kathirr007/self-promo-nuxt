export const state = () => ({
  projectHero: {}
});

export const actions = {
  createHero({ commit, state }, projectHeroData) {
    return this.$axios
      .$post("/api/v1/product-heroes", projectHeroData)
      .then(hero => {
        commit("setHero", hero);
        return state.projectHero;
      })
      .catch(err => Promise.reject(err));
  },
  fetchHero({ commit, state }) {
    return this.$axios
      .$get("/api/v1")
      .then(data => {
        // debugger
        const { productHero } = data;
        commit("setHero", productHero);
        return state.projectHero;
      })
      .catch(err => Promise.error(err));
  }
};

export const mutations = {
  setHero(state, hero) {
    state.projectHero = hero;
  }
};
