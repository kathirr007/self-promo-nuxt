import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu({
    formatters: true,
    vue: true,
    rules: {
      'no-console': 'off',
      'vue/no-multiple-template-root': 'off',
      'unused-imports/no-unused-vars': 'off',
      'node/prefer-global/process': 'off',
    },
  }),
)
