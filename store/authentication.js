export const state = () => ({
  user: null
});

export const getters = {
  authUser(state) {
    return state.user || null;
  },
  isAuthenticated(state) {
    /* if (state.user) {
            return true
        } else {
            return false
        } */
    return !!state.user;
  },
  isAdmin(state) {
    return state.user && state.user.role && state.user.role === "admin";
  }
};

export const actions = {
  login({ commit }, loginData) {

    return this.$axios
      .$post("/api/v1/users/login", loginData)
      .then(user => {

        commit("setAuthUser", user);
        return user;
      })
      .catch(error => Promise.reject(error));
  },
  resetPassword({ commit }, resetData) {

    return this.$axios
      .$post("/api/v1/users/resetPassword", resetData)
      .then(res => {

        // commit("setAuthUser", user);
        return res;
      })
      .catch(error => Promise.reject(error));
  },
  logout({ commit }) {

    return this.$axios
      .$post("/api/v1/users/logout")
      .then(() => {

        commit("setAuthUser", null);
        return true;
      })
      .catch(error => Promise.reject(error));
  },
  register(_, registerData) {

    return this.$axios
      .$post("/api/v1/users/register", registerData)
      .then(user => {
        return user;
      })
      .catch(error => {
        let errorMessage =
          "Uuuups, something went wrong. Please try register again!";
        if (error.response.data.errors) {
          errorMessage = error.response.data.errors.message;
        }
        return Promise.reject(errorMessage);
      });
  },
  getAuthUser({ commit, getters, state }) {
    const authUser = getters.authUser;

    if (authUser) {
      return Promise.resolve(authUser);
    }

    return this.$axios
      .$get("/api/v1/users/me")
      .then(user => {
        commit("setAuthUser", user);
        return state.user;
      })
      .catch(error => {
        commit("setAuthUser", null);
        return Promise.reject(error);
      });
  }
};

export const mutations = {
  setAuthUser(state, user) {
    state.user = user;
  }
};
