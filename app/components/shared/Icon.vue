<script setup lang="ts">
import type { IconProps } from '~/types'

withDefaults(defineProps<IconProps>(), {
  name: '',
  size: 'normal',
})
</script>

<template>
  <i class="icon fas" :class="[`fa-${name}`, `icon-size-${size}`]" />
</template>

<style lang="scss" scoped>
.icon {
  &-size {
    &-small {
      font-size: 15px;
    }
    &-normal {
      font-size: 18px;
    }
    &-large {
      font-size: 21px;
    }
  }
}
</style>
