<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const adminStore = useAdminStore()
const heroesStore = useHeroesStore()

const { refresh } = await useAsyncData('admin-heroes', () => adminStore.fetchHeroes())

onMounted(async () => {
  await refresh()
})

const heroes = computed(() => adminStore.heroes)
const activeHero = computed(() => heroesStore.projectHero)

const modalRefs = ref<Record<string, any>>({})
const isActivating = ref(false)
const isDeleting = ref(false)
const activatingHeroId = ref<string | null>(null)
const deletingHeroId = ref<string | null>(null)

function openModal(heroId: string) {
  modalRefs.value[heroId]?.openModal()
}

async function activateHero({ closeModal }: { closeModal: () => void }, heroId: string) {
  isActivating.value = true
  activatingHeroId.value = heroId
  try {
    await adminStore.activateHero(heroId)
    closeModal()
  }
  finally {
    isActivating.value = false
    activatingHeroId.value = null
  }
}

async function deleteHero({ closeModal }: { closeModal: () => void }, heroId: string) {
  isDeleting.value = true
  deletingHeroId.value = heroId
  try {
    await adminStore.deleteHero(heroId)
    closeModal()
  }
  finally {
    isDeleting.value = false
    deletingHeroId.value = null
  }
}
</script>

<template>
  <div class="admin-page">
    <SharedHeader title="Manage Hero Images" exit-link="/" />
    <div class="heroes-page">
      <div class="container">
        <h1 class="title">
          Project Hero Images
        </h1>
        <table class="heroes-table table is-responsive" role="grid">
          <thead>
            <tr class="main-table-row">
              <th width="45%">
                Image
              </th>
              <th width="25%">
                Title
              </th>
              <th width="25%">
                Subtitle
              </th>
              <th width="5%">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="hero in heroes"
              :key="hero._id"
              tabindex="0"
              class="table-row"
              role="link"
              :class="[activeHero._id === hero._id ? 'isActive' : '']"
              @click="openModal(hero._id)"
              @keyup.enter="openModal(hero._id)"
            >
              <td style="word-break: break-all">
                {{ hero.image || 'No image added' }}
              </td>
              <td>{{ hero.title || 'No title set' }}</td>
              <td>{{ hero.subtitle || 'Subtitle not set' }}</td>
              <td>{{ activeHero._id === hero._id ? 'Active' : 'Inactive' }}</td>
            </tr>
          </tbody>
        </table>

        <Teleport to="body">
          <SharedModal
            v-for="hero in heroes"
            :key="hero._id"
            :ref="(el: any) => { if (el) modalRefs[hero._id] = el }"
            :show-button="false"
            action-title="Make Active"
            remove-action-title="Remove"
            title="Make Project Hero"
            @submitted="activateHero($event, hero._id)"
            @deleted="deleteHero($event, hero._id)"
          >
            <div>
              <div class="subtitle">
                Title: {{ hero.title || 'Title is not set' }}
              </div>
              <div class="subtitle">
                Subtitle: {{ hero.subtitle || 'Subtitle not set' }}
              </div>
              <figure class="image project-image is-3by1">
                <img :src="hero.image" :alt="hero.title">
              </figure>
            </div>
          </SharedModal>
        </Teleport>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.heroes-page {
  max-width: 1000px;
  margin: 40px auto 5rem auto;
}
.title {
  font-size: 45px;
  font-weight: bold;
}
.project-image img {
  object-fit: cover;
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
