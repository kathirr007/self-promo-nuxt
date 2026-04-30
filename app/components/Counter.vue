<script setup lang='ts'>
const { count, inc, dec } = useCount()
</script>

<template>
  <div class="inline-flex my-3">
    <button class="rounded-full p-2 btn" @click="dec()">
      <Icon name="cil-minus" class="text-lg text-teal-700" />
    </button>
    <div class="border p-1 border-gray-400 rounded-md font-mono w-16 m-auto inline-block">
      {{ count }}
    </div>
    <button class="rounded-full p-2 btn" @click="inc()">
      <Icon name="cil:plus" class="text-teal-700 text-lg" />
    </button>
  </div>
</template>
