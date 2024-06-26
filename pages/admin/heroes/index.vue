<template>
  <div class="admin-page">
    <adminHeader title="Manage Hero Images" exitLink="/">
    </adminHeader>
    <div class="heroes-page">
      <div class="container">
        <h1 class="title">Project Heroe Images</h1>
        <portal-target
          v-for="hero in heroes"
          :key="hero._id"
          :name="`modal-view-${hero._id}`"
        />
        <table class="heroes-table table is-responsive" role="grid">
          <thead>
            <tr class="main-table-row">
              <th width="45%">Image</th>
              <th width="25%">Title</th>
              <th width="25%">Subtitle</th>
              <th width="5%">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="hero in heroes"
              :key="hero._id"
              @click="openModal(hero._id)"
              @keyup.enter="openModal(hero._id)"
              tabindex="0"
              class="table-row"
              role="link"
              :class="[activeHero._id === hero._id ? 'isActive' : '']"
            >
              <td style="word-break: break-all">
                {{ hero.image || "No image added" }}
              </td>
              <td>{{ hero.title || "No title set" }}</td>
              <td>{{ hero.subtitle || "Subtitle not set" }}</td>
              <td>{{ activeHero._id === hero._id ? "Active" : "Inactive" }}</td>
              <td class="modal-td" v-show="false">
                <portal :to="`modal-view-${hero._id}`">
                  <Modal
                    @submitted="activateHero($event, hero._id)"
                    @deleted="deleteHero($event, hero._id)"
                    :ref="`modal-${hero._id}`"
                    :showButton="false"
                    actionTitle="Make Active"
                    removeActionTitle="Remove"
                    openTitle="Favorite"
                    title="Make Project Hero"
                  >
                    <div>
                      <div class="subtitle">
                        Title: {{ hero.title || "Title is not set" }}
                      </div>
                      <div class="subtitle">
                        Subtitle: {{ hero.subtitle || "Subtitle not set" }}
                      </div>
                      <figure class="image project-image is-3by1">
                        <img :src="hero.image" :alt="hero.title" />
                      </figure>
                    </div>
                  </Modal>
                </portal>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import Modal from "~/components/shared/Modal";
import adminHeader from "~/components/shared/Header";
import confirmDelete from "~/mixins/confirmDelete";

export default {
  layout: "admin",
  middleware: "admin",
  components: {
    Modal,
    adminHeader
  },
  mixins: [confirmDelete],
  computed: {
    heroes() {
      return this.$store.state.admin.heroes;
    },
    activeHero() {
      return this.$store.state.heroes.projectHero;
    }
  },
  async fetch({ store }) {
    await store.dispatch("admin/fetchHeroes");
  },
  methods: {
    openModal(modalId) {
      const modal = this.$refs[`modal-${modalId}`][0];
      // debugger
      modal.openModal();
    },
    activateHero({ closeModal }, heroId) {
      this.$store.dispatch("admin/activateHero", heroId).then(_ => {
        this.$toasted.success("Hero was successfully activated..!", {
          duration: 3000
        });
        closeModal();
      });
    },
    deleteHero({ closeModal }, heroId) {
      this.$store.dispatch("admin/deleteHero", heroId).then(_ => {
        // debugger
        this.$toasted.success("Hero was successfully deleted..!", {
          duration: 3000
        });
        closeModal();
      });
    }
  }
};
</script>
<style scoped lang="scss">
.heroes-page {
  max-width: 1000px;
  margin: 0 auto 5rem auto;
  margin-top: 40px;
}

.title {
  font-size: 45px;
  font-weight: bold;
}

.isActive {
}

.project-image {
  img {
    object-fit: cover;
  }
}

.table-row {
  margin: 20px;

  &.isActive {
    background-color: #dfffe1;
  }

  &:hover {
    cursor: pointer;
    background-color: #e4e4e4;
  }
}
</style>
