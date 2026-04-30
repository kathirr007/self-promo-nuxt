<script setup>
import { useNotivue } from 'notivue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '~/composables/authentication'

const router = useRouter()
const $notivue = useNotivue()
const authStore = useAuthenticationStore()

// Reactive data
const isActive = ref(false)

// Computed properties
const user = computed(() => authStore.authUser)
const isAuth = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const isLoggedIn = computed(() => authStore.isAuthenticated)
const googleUser = computed(() => authStore.user?.name)
const googleUserAvatar = computed(() => authStore.user?.picture)

const production = computed(() => {
  if (import.meta.client) {
    return window.location.hostname !== 'localhost'
  }
  return ''
})

const prodOnline = computed(() => {
  return process.env.BASE_URL
})

// Methods
function toggleNavbar() {
  isActive.value = !isActive.value
}

async function logout() {
  try {
    await authStore.logout()
    isActive.value = !isActive.value
    await router.push('/login')
    /* $notivue.notify({
      title: 'Successfully logged out...',
      type: 'success',
      duration: 3000,
    }) */
    push.success({
      title: 'Logout',
      message: 'Successfully logged out...',
      duration: 3000,
    })
  }
  catch (err) {
    push.error({
      title: 'Logout',
      message: 'There is something wrong.. 😒',
      duration: 3000,
    })
  }
}

function googleLogout() {
  isActive.value = !isActive.value
  // Note: $auth might need to be replaced with appropriate Nuxt 4 auth method
  // This depends on your auth module implementation
}
</script>

<template>
  <nav
    class="navbar is-active is-dark"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <NuxtLink class="navbar-item" to="/">
        <h1 class="brand-title">
          Kathiravan K
        </h1>
        <figure class="image avatar is-48x48">
          <img
            class="is-rounded"
            src="/profile-photo.jpg"
            alt="Profile photo"
            width="48"
            height="48"
          >
        </figure>
      </NuxtLink>
      <!-- Adds click to open -->
      <!-- Adds active class -->
      <a
        :class="{ 'is-active': isActive }"
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="toggleNavbar"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <!-- Adds active class -->
    <div
      id="navbarBasicExample"
      class="navbar-menu"
      :class="{ 'is-active': isActive }"
    >
      <div class="navbar-start">
        <NuxtLink to="/" class="navbar-item" @click="toggleNavbar">
          Home
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="navbar-item"
          @click="toggleNavbar"
        >
          Projects
        </NuxtLink>
        <!-- <NuxtLink @click="toggleNavbar" to="/admin/projects" class="navbar-item">
          Projects
        </NuxtLink> -->
        <NuxtLink
          to="/experiences"
          class="navbar-item"
          @click="toggleNavbar"
        >
          Experiences
        </NuxtLink>
        <NuxtLink to="/about" class="navbar-item" @click="toggleNavbar">
          About
        </NuxtLink>
        <NuxtLink to="/cv" class="navbar-item" @click="toggleNavbar">
          Cv
        </NuxtLink>
        <!-- <NuxtLink @click="toggleNavbar" to="/admin" class="navbar-item">
          admin
        </NuxtLink>
        <NuxtLink @click="toggleNavbar" to="/secret" class="navbar-item">
          Secret
        </NuxtLink> -->
      </div>

      <ClientOnly>
        <div v-if="!production" class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <!-- If Authenticated -->
              <template v-if="isAuth || isLoggedIn">
                <figure class="image avatar is-48x48 m-r-sm">
                  <img
                    class="is-rounded"
                    :src="user ? user.avatar : googleUserAvatar"
                    alt="User Avatar"
                    height="48"
                    width="48"
                  >
                </figure>
                <div class="m-r-sm m-b-sm">
                  Welcome {{ user ? user.username : googleUser }}!
                </div>
                <!-- If Admin -->
                <button
                  v-if="isAdmin"
                  class="button is-info"
                  @click="router.push('/admin')"
                >
                  Admin
                </button>
                <a v-if="user" class="button is-primary" @click.prevent="logout">Logout</a>
                <a
                  v-else
                  class="button is-primary"
                  @click.prevent="googleLogout"
                >Logout</a>
              </template>
              <template v-else>
                <NuxtLink
                  to="/register"
                  class="button is-primary"
                  @click="toggleNavbar"
                >
                  Sign up
                </NuxtLink>
                <NuxtLink
                  to="/login"
                  class="button is-light"
                  @click="toggleNavbar"
                >
                  Log in
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar-brand {
  .brand-title {
    font-size: 35px;
    font-weight: bold;
    display: none;
  }
  // padding-right: 30px;
}
.navbar-item {
  flex-shrink: unset;
  img,
  svg {
    max-height: unset;
  }
}
.avatar {
  margin-right: 5px;
}
.navbar-burger {
  color: $color-white;
}
</style>
