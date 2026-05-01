<script setup lang="ts">
import type { HeaderProps } from '~/types'

withDefaults(defineProps<HeaderProps>(), {
  exitLink: null,
})

const router = useRouter()
const authStore = useAuthenticationStore()
const user = computed(() => authStore.authUser)

async function logout() {
  try {
    await authStore.logout()
    await router.push('/login')
  }
  catch {
    console.error('Logout failed')
  }
}
</script>

<template>
  <div class="full-page-takeover-header">
    <div class="full-page-takeover-header-logo">
      <NuxtLink to="/admin" class="has-text-white" aria-label="Admin home">
        <h1 class="full-page-takeover-header-logo-title">
          <button class="button is-outlined is-medium">
            <span class="icon">
              <span class="sr-only is-hidden">Admin home</span>
              <i class="fas fa-home" />
            </span>
          </button>
        </h1>
      </NuxtLink>
    </div>
    <div class="full-page-takeover-header-divider" />
    <header class="full-page-takeover-header-text">
      <h1 class="title is-3 is-line-height-normal has-text-white">
        {{ title }}
      </h1>
    </header>
    <div class="user-box">
      <figure class="image is-48x48 m-r-sm">
        <img class="is-rounded" :src="user?.avatar" alt="User avatar" height="48" width="48">
      </figure>
      <div class="m-r-sm">
        Welcome {{ user?.username }}!
      </div>
    </div>
    <slot name="actionMenu" />
    <div v-if="exitLink" class="full-page-takeover-header-button">
      <a
        v-if="user"
        class="button is-danger mr-4"
        tabindex="0"
        aria-label="logout"
        @click.prevent="logout"
      >Logout</a>
      <NuxtLink :to="exitLink" class="button is-outlined">
        Exit
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-box {
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-right: 10px;
  font-size: 17px;
  font-weight: bold;

  @media screen and (max-width: 650px) {
    font-size: 12px;
    .image {
      height: auto;
    }
  }
}
</style>
