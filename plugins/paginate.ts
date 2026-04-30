import { defineComponent, defineNuxtPlugin, h } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const Paginate = defineComponent({
    name: 'Paginate',
    props: {
      pageCount: { type: Number, required: true },
      modelValue: { type: Number, default: 1 },
      prevText: { type: String, default: 'Previous' },
      nextText: { type: String, default: 'Next' },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const setPage = (page: number) => {
        if (page >= 1 && page <= props.pageCount && page !== props.modelValue) {
          emit('update:modelValue', page)
        }
      }

      return () =>
        h('nav', { 'class': 'pagination is-centered', 'role': 'navigation', 'aria-label': 'pagination' }, [
          h(
            'button',
            {
              class: ['pagination-previous', { 'is-disabled': props.modelValue <= 1 }],
              disabled: props.modelValue <= 1,
              onClick: () => setPage(props.modelValue - 1),
            },
            props.prevText,
          ),
          h(
            'button',
            {
              class: ['pagination-next', { 'is-disabled': props.modelValue >= props.pageCount }],
              disabled: props.modelValue >= props.pageCount,
              onClick: () => setPage(props.modelValue + 1),
            },
            props.nextText,
          ),
          h(
            'ul',
            { class: 'pagination-list' },
            Array.from({ length: props.pageCount }, (_, index) => {
              const page = index + 1
              const isActive = page === props.modelValue
              return h(
                'li',
                { key: page },
                h(
                  'button',
                  {
                    class: ['pagination-link', { 'is-current': isActive }],
                    onClick: () => setPage(page),
                    type: 'button',
                  },
                  String(page),
                ),
              )
            }),
          ),
        ])
    },
  })

  nuxtApp.vueApp.component('Paginate', Paginate)
})
