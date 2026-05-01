import { defineNuxtPlugin } from '#app'

const defaultQuillOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      ['clean'],
      ['link'],
    ],
  },
  placeholder: 'Global placeholder...',
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      quillOptions: defaultQuillOptions,
    },
  }
})
