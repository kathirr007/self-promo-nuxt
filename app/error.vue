<script>
import ErrorView from '@/components/shared/ErrorView'

export default {
  components: {
    ErrorView,
  },
}
</script>

<template>
  <div class="container">
    <ErrorView
      title="Ooooops, the page you are trying to access doesn't exist 😒"
      status="404"
      navigate-to-page="/"
      navigate-to-text="Navigate back to Home Page"
    />
  </div>
</template>

<style scoped></style>
