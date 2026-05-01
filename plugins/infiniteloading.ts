import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const InfiniteLoading = defineComponent({
    name: 'InfiniteLoading',
    props: {
      disabled: { type: Boolean, default: false },
      spinner: { type: String, default: 'default' },
      threshold: { type: Number, default: 0.85 },
    },
    emits: ['load'],
    setup(props, { emit }) {
      const sentinel = ref<HTMLElement | null>(null)
      let observer: IntersectionObserver | null = null

      const createObserver = () => {
        if (import.meta.client && window.IntersectionObserver && sentinel.value) {
          observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting && !props.disabled) {
                emit('load')
              }
            },
            {
              threshold: props.threshold,
            },
          )
          if (sentinel.value)
            observer.observe(sentinel.value)
        }
      }

      onMounted(() => {
        if (!props.disabled) {
          createObserver()
        }
      })

      onBeforeUnmount(() => {
        if (observer) {
          observer.disconnect()
          observer = null
        }
      })

      watch(
        () => props.disabled,
        (value) => {
          if (value && observer) {
            observer.disconnect()
            observer = null
          }
          else if (!value) {
            createObserver()
          }
        },
      )

      return () =>
        h('div', { class: 'infinite-loading-wrapper' }, [
          h('div', { class: 'infinite-loading-sentinel', ref: sentinel }),
          h('div', { class: 'infinite-loading-spinner' }, props.spinner),
        ])
    },
  })

  nuxtApp.vueApp.component('InfiniteLoading', InfiniteLoading)
})
