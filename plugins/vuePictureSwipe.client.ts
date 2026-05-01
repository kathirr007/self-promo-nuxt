import { defineComponent, h, ref, watch } from 'vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const VuePictureSwipe = defineComponent({
    name: 'VuePictureSwipe',
    props: {
      images: { type: Array as () => string[], required: true },
      modelValue: { type: Boolean, default: false },
      startIndex: { type: Number, default: 0 },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const currentIndex = ref(Math.min(Math.max(props.startIndex, 0), props.images.length - 1))

      watch(
        () => props.startIndex,
        (value) => {
          currentIndex.value = Math.min(Math.max(value, 0), props.images.length - 1)
        },
      )

      const close = () => {
        emit('update:modelValue', false)
      }

      const next = () => {
        currentIndex.value = Math.min(currentIndex.value + 1, props.images.length - 1)
      }

      const prev = () => {
        currentIndex.value = Math.max(currentIndex.value - 1, 0)
      }

      return () =>
        props.modelValue
        && h('div', { class: 'vue-picture-swipe-overlay' }, [
          h('div', { class: 'vue-picture-swipe-backdrop', onClick: close }),
          h('div', { class: 'vue-picture-swipe-body' }, [
            h('button', { class: 'vue-picture-swipe-close', onClick: close, type: 'button' }, '×'),
            h('img', { src: props.images[currentIndex.value], alt: `Image ${currentIndex.value + 1}` }),
            h('div', { class: 'vue-picture-swipe-actions' }, [
              h(
                'button',
                { type: 'button', onClick: prev, disabled: currentIndex.value <= 0 },
                'Prev',
              ),
              h(
                'button',
                { type: 'button', onClick: next, disabled: currentIndex.value >= props.images.length - 1 },
                'Next',
              ),
            ]),
          ]),
        ])
    },
  })

  nuxtApp.vueApp.component('VuePictureSwipe', VuePictureSwipe)
})
