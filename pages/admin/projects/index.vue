<template>
  <div>
    <admin-header title="Manage your Projects here">
      <template #actionMenu>
        <div class="full-page-takeover-header-button">
          <nuxt-link to="/admin/project/create" class="button is-light"
            >New Project</nuxt-link
          >
          <nuxt-link to="/" class="button is-danger is-inverted is-outlined">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span class>FrontEnd</span>
          </nuxt-link>
        </div>
      </template>
    </admin-header>
    <div class="projects-page">
      <div class="container">
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <h1 class="projects-page-title">Your Projects</h1>
            <!-- Iterate Projects -->
            <div
              v-for="project in projects"
              :key="project._id"
              class="tile is-ancestor"
            >
              <div class="tile is-parent is-12">
                <!-- Navigate to project manage page -->
                <div class="tile tile-overlay-container is-child box">
                  <div class="tile-overlay">
                    <nuxt-link
                      :to="`/admin/project/${project._id}/manage`"
                      class="tile-overlay-text"
                    >
                      <span>Update Project</span>
                    </nuxt-link>
                    <span
                      @click="confirmDelete($event, 'project', project)"
                      @keyup.enter="confirmDelete($event, 'project', project)"
                      class="tile-overlay-text has-text-danger"
                      >Delete Project</span
                    >
                  </div>
                  <div class="columns">
                    <div class="column is-narrow">
                      <figure class="image is-4by2 is-128x128">
                        <!-- <img :src="'https://i.udemycdn.com/project/750x422/2381802_d90c_3.jpg'"> -->
                        <img
                          :alt="project.title"
                          :src="
                            project.image ||
                              'https://via.placeholder.com/200.png'
                          "
                        />
                      </figure>
                    </div>
                    <div class="column">
                      <p class="title">{{ project.title }}</p>
                      <p class="subtitle">
                        {{ project.subtitle || "No subtitle provided yet" }}
                      </p>
                      <span
                        class="tag"
                        :class="projectStatusClass(project.status)"
                        >{{ project.status }}</span
                      >
                    </div>
                    <!-- <div class="column is-narrow flex-centered">
                      <div class="price-title">
                        {{project.price || 0}} $
                      </div>
                    </div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adminHeader from "~/components/shared/Header";
import confirmDelete from "~/mixins/confirmDelete";
export default {
  // middleware: 'admin',
  layout: "admin",
  components: {
    adminHeader
  },
  mixins: [confirmDelete],
  computed: {
    projects() {
      return this.$store.state.admin.project.items;
    }
  },
  async fetch({ store }) {
    await store.dispatch("admin/project/fetchadminProjects");
  },
  methods: {
    projectStatusClass(status) {
      if (!status) return "";
      if (status === "published") return "is-success";
      if (status === "active") return "is-primary";
      if (status === "inactive") return "is-warning";
      if (status === "deleted") return "is-danger";
    }
  }
};
</script>
<style scoped lang="scss">
figure {
  &.image.is-128x128 {
    img {
      height: 100%;
      object-fit: contain;
      object-position: top;
    }
    @media screen and (max-width: 768px) {
      width: 100%;
      height: auto;
    }
  }
}
.tile-image {
  float: left;
}

.price-title {
  font-size: 40px;
  font-weight: bold;
}

.flex-centered {
  align-items: center;
  justify-content: flex-end;
  display: flex;
}

.tile-overlay-container {
  position: relative;

  &:hover {
    box-shadow: none;
  }

  &:hover > .tile-overlay {
    background-color: rgba(255, 255, 255, 0.9);
  }

  &:hover .tile-overlay-text {
    visibility: visible;
  }

  .tile-overlay {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    bottom: 0;
    width: auto;
    right: 0;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    @media screen and (max-width: 768px) {
      flex-flow: column;
    }

    &-text {
      color: #58529f;
      visibility: hidden;
      /* position: absolute;
        top: 0;
        left: 0; */
      width: 100%;
      height: 100%;
      font-size: 18px;
      white-space: pre-wrap;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 700;
      white-space: nowrap;
    }
  }
}

.projects-page {
  padding-top: 60px;

  &-title {
    font-size: 40px;
    font-weight: bold;
    padding-bottom: 20px;
  }
  .tag {
    text-transform: capitalize;
  }
}
</style>
