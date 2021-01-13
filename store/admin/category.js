export const state = () => ({
  items: [],
  item: {},
  canUpdateCategory: false
});

export const actions = {
  fetchadminCategories({ commit }) {
    // debugger
    return this.$axios
      .$get("/api/v1/categories")
      .then(categories => {
        commit("setCategories", categories);
        return state.items;
      })
      .catch(error => Promise.reject(error));
  },
  fetchCategoryById({ commit, state }, categoryId) {
    return this.$axios
      .$get(`/api/v1/categories/${categoryId}`)
      .then(category => {
        commit("setCategory", category);
        return state.item;
      })
      .catch(error => Promise.reject(error));
  },
  createCategory(_, categoryData) {
    // debugger
    return this.$axios
      .$post("/api/v1/categories/", categoryData)
      .then(category => this.$router.push("/admin/categories"));
  },
  createCategory2({ commit, state }, categoryData) {
    // debugger
    return this.$axios
      .$post("/api/v1/categories/", categoryData)
      .then(category => {
        commit("pushCategory", category);
        // this.$router.push('/admin/categories')
      });
  },
  updateCategory({ commit, state }, category) {
    // debugger
    // const category = state.item
    return this.$axios
      .$patch(`/api/v1/categories/${category._id}`, category)
      .then(category => {
        // debugger
        const categoryIndex = state.items.findIndex(
          b => b._id === category._id
        );
        commit("setCategory", { category, categoryIndex });
        // return state.item
      })
      .catch(err => Promise.reject(err));
  },
  deleteCategory({ commit, state }, category) {
    // debugger
    // const category = state.item
    return this.$axios
      .$delete(`/api/v1/categories/${category._id}`, category)
      .then(_ => {
        const categoryIndex = state.items.findIndex(
          b => b._id === category._id
        );
        commit("deleteCategory", { categoryIndex });
        return true;
      })
      .catch(err => Promise.reject(err));
  }
};

export const mutations = {
  setCategories(state, categories) {
    state.items = categories;
  },
  pushCategory(state, category) {
    // debugger
    state.items.push(category);
  },
  setCategory(state, { category, categoryIndex }) {
    // debugger
    state.item = category;
    state.items[categoryIndex] = category;
  },
  setCanUpdateCourse(state, canUpdate) {
    state.canUpdateCourse = canUpdate;
  },
  addLine(state, field) {
    state.item[field].push({ value: "" });
  },
  removeLine(state, { field, index }) {
    state.item[field].splice(index, 1);
  },
  setLineValue(state, { index, value, field }) {
    state.item[field][index].value = value;
  },
  setCourseValue(state, { value, field }) {
    state.item[field] = value;
  },
  deleteCategory(state, { categoryIndex }) {
    state.items.splice(categoryIndex, 1);
  }
};
