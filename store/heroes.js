export const state = () => ({
  courseHero: {}
})

export const actions = {
  createHero({commit, state}, courseHeroData) {
    return this.$axios.$post('/api/v1/product-heroes', courseHeroData)
      .then(hero => {
        commit('setHero', hero)
        return state.courseHero
      })
      .catch(err => Promise.reject(err))
  },
  fetchHero({commit, state}) {
    return this.$axios.$get('/api/v1')
      .then(data => {
        const { productHero } = data
        commit('setHero', productHero)
        return state.courseHero
      })
      .catch(err => Promise.error(err))
  }
}

export const mutations = {
  setHero(state, hero) {
    state.courseHero = hero
  }
}
