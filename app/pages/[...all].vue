<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="container">
    <SharedErrorView
      title="Ooooops, the page you are trying to access doesn't exist 😒"
      status="404"
      navigate-to-page="/"
      navigate-to-text="Navigate back to Home Page"
    />
  </div>
</template>
