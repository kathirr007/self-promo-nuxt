const slugify = require("slugify");

export const state = () => ({
  items: [],
  item: {
    storageLocation: null
  },
  canUpdateCourse: false
});

export const actions = {
  fetchadminCourses({ commit }) {
    return this.$axios
      .$get("/api/v1/products/user-products")
      .then(projects => {
        commit("setCourses", projects);
        return state.items;
      })
      .catch(error => Promise.reject(error));
  },
  fetchCourseById({ commit, state }, projectId) {
    return this.$axios
      .$get(`/api/v1/products/${projectId}`)
      .then(project => {
        commit("setCourse", project);
        return state.item;
      })
      .catch(error => Promise.reject(error));
  },
  createCourse({ commit, state }, projectData) {
    let storageLocation = `projects/${slugify(projectData.title, {
      replacement: "-", // replace spaces with replacement
      remove: null, // regex to remove characters
      lower: true // result in lower case
    })}`;
    commit("setCourseValue", { value: projectData.title, field: "title" });
    return this.$axios
      .$post("/api/v1/products/", projectData)
      .then(_ => this.$router.push("/admin/projects"));
  },
  updateCourse({ commit, state }) {
    const project = state.item;
    // debugger
    /*     let storageLocationOld = null
    let storageLocationNew
    storageLocationNew = `projects/${slugify(project.title, {
      replacement: '-',    // replace spaces with replacement
      remove: null,        // regex to remove characters
      lower: true          // result in lower case
    })}`;
    storageLocationNew === storageLocationOld ? storageLocationOld : storageLocationOld = storageLocationNew */
    let data = new FormData();
    let uploadedFiles = null;
    let deleteFiles = false;
    if (
      project.images[0] != undefined &&
      typeof project.images[0]["location"] == "undefined"
    ) {
      for (let i = 0; i < project.images.length; i++) {
        // debugger
        data.append("images", project.images[i]);
        uploadedFiles = JSON.stringify(project.uploadedFiles);
        deleteFiles = true;
      }
    } else {
      uploadedFiles = JSON.stringify(project.images);
      data.append("images", uploadedFiles);
    }

    data.append("authorID", project.author);
    data.append("categoryID", project.category);
    data.append("createdAt", project.createdAt);
    data.append("description", project.description);
    data.append("promoVideoLink", project.promoVideoLink);
    data.append("productLink", project.productLink);
    data.append("requirements", JSON.stringify(project.requirements));
    // data.append('slug', project.slug)
    data.append("status", project.status);
    data.append("subtitle", project.subtitle);
    data.append("title", project.title);
    data.append("storageLocation", project.storageLocation);
    data.append("storageLocationNew", project.storageLocationNew);
    data.append("updatedAt", project.updatedAt);
    data.append("wsl", JSON.stringify(project.wsl));

    // project.data = data

    // debugger
    const headers = {
      storagelocation: project.storageLocation,
      storagelocationnew: project.storageLocationNew,
      uploadedfiles: uploadedFiles,
      deletefiles: deleteFiles
    };

    return this.$axios
      .$patch(`/api/v1/products/${project._id}`, data, { headers: headers })
      .then(project => {
        commit("setCourse", project);
        return state.item;
      })
      .catch(err => Promise.reject(err));
  },
  deleteCourseImage({ commit, state }, params) {
    // const resource = project.status === 'active' ? 'drafts' : 'published'
    // debugger
    return this.$axios
      .$delete(`/api/v1/products/ProdImage/${params.key}`, {
        headers: { storagelocation: params.s3Key }
      })
      .then(_ => {
        // const projectIndex = state.items.findIndex((b) => b._id === project._id)
        commit("setCanUpdateCourse", true);
        return true;
      })
      .catch(err => Promise.reject(err));
  },
  deleteCourse({ commit, state }, project) {
    // const resource = project.status === 'active' ? 'drafts' : 'published'
    // debugger
    const uploadedFiles = JSON.stringify(project.images);
    const headers = {
      storagelocation: project.storageLocation,
      storagelocationnew: project.storageLocationNew,
      uploadedfiles: uploadedFiles,
      deletefiles: "true"
    };
    return this.$axios
      .$delete(`/api/v1/products/${project._id}`, { headers: headers })
      .then(_ => {
        const projectIndex = state.items.findIndex(b => b._id === project._id);
        commit("deleteCourse", { projectIndex });
        return true;
      })
      .catch(err => Promise.reject(err));
  },
  updateLine({ commit }, { index, value, field }) {
    commit("setLineValue", { index, value, field });
    commit("setCanUpdateCourse", true);
  },
  updateCourseValue({ commit }, { value, field, title }) {
    commit("setCourseValue", { value, field });
    if (field === "title") {
      if (value && value.length >= 10) {
        // debugger
        commit("setCanUpdateCourse", true);
      } else {
        commit("setCanUpdateCourse", false);
      }
    } else {
      commit("setCanUpdateCourse", true);
    }
  },
  updateCourseImage({ commit }, { index, field, title }) {
    commit("removeCourseImage", { index, field });
    /* if(title && title.length >= 10) {
      debugger
      commit('setCanUpdateCourse', true)
    } */
  },
  updateUploadedFiles({ commit }, value) {
    // debugger
    commit("setUploadedFiles", value);
  },
  updateCanUpdate({ commit }) {
    commit("setCanUpdateCourse", true);
  }
};

export const mutations = {
  setCourses(state, projects) {
    state.items = projects;
  },
  setCourse(state, project) {
    state.item = project;
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
  removeCourseImage(state, { field, index }) {
    // debugger
    state.item[field].splice(index, 1);
  },
  setLineValue(state, { index, value, field }) {
    state.item[field][index].value = value;
  },
  setCourseValue(state, { value, field }) {
    if (field === "title") {
      // debugger
      let storageLocationNew = `projects/${slugify(value, {
        replacement: "-", // replace spaces with replacement
        remove: null, // regex to remove characters
        lower: true // result in lower case
      })}`;
      if (storageLocationNew !== state.item["storageLocation"]) {
        state.item["storageLocation"] = storageLocationNew;
        state.item["storageLocationNew"] = storageLocationNew;
      }
    }
    state.item[field] = value;
  },
  setUploadedFiles(state, value) {
    // debugger
    state.item["uploadedFiles"] = value;
  },
  deleteCourse(state, { projectIndex }) {
    state.items.splice(projectIndex, 1);
  }
};
