<script setup lang="ts">
const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <div>
    <input
      id="input"
      v-model="name"
      placeholder="What's your name?"
      type="text" autocomplete="off"
      class="border text-center bg-transparent mt-5 w-[250px] px-4 py-2 rounded gray-200 dark:gray-700 outline-none active:outline-none"
      @keydown.enter="go"
    >
    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!name"
        @click="go"
      >
        GO
      </button>
    </div>
  </div>
</template>
