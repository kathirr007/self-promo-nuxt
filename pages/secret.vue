<template>
    <div>
        <h2>This is secret page for only authenticated users..</h2>
        <h2>This is secret page for only authenticated users..</h2>
        <h2>This is secret page for only authenticated users..</h2>
    </div>
</template>

<script>
    export default {
        middleware: 'auth'
    }
</script>

<style lang="scss" scoped>

</style>