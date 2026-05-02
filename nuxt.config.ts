// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-05-02',
  telemetry: false,
  devServer: {
    port: Number(process.env.PORT || 3600),
  },
  sourcemap: {
    server: true,
    client: true,
  },
  // devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Kathiravan K | Sr.UI Developer | Portfolio',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'google-site-verification',
          content: 'w4IPzZUmq92f1hdY9DpTVfDBF67pwaNGZpvNxGqmVHU',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: process.env.npm_package_description
            || `My Name is Kathiravan K, and I'm an Sr.UI Developer with a strong working experience in web technologies. I'm an accomplished individual with a strong Front-End Web development background in Digital Marketing, HTML/HTML5, CSS/CSS3, SASS, LESS, Javascript, jQuery, JSON, Ajax, Node.js, Express.js, Gulp.js, Vue.js, Vuetify.js, Nuxt.js, MongoDB, Bootstrap, BootstrapVue, SPA, Firebase/Firestore, Git/Github, Continuous Integration (CI). Having expertise working knowledge on Adobe Photoshop CC and Dreamweaver CC. I strongly believe in the power of the Internet, and have an intense desire to learn how to improve the webs core functionality, and to also be involved in its future development. I have a good understand of programming, can come up with plenty of innovative ideas and possess good communication skills.`,
        },
        { property: 'og:title', content: 'Kathiravan K | Sr.UI Developer' },
        { property: 'og:locale', content: 'en_US' },
        {
          property: 'og:url',
          content: process.env.NUXT_PUBLIC_SITE_URL || process.env.BASE_URL || 'http://localhost:3600',
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:image',
          content: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80',
        },
        {
          property: 'og:description',
          content: `My Name is Kathiravan K, and I'm an Sr.UI Developer with a strong working experience in web technologies. I'm an accomplished individual with a strong Front-End Web development background in Digital Marketing, HTML/HTML5, CSS/CSS3, SASS, LESS, Javascript, jQuery, JSON, Ajax, Node.js, Express.js, Gulp.js, Vue.js, Vuetify.js, Nuxt.js, MongoDB, Bootstrap, BootstrapVue, SPA, Firebase/Firestore, Git/Github, Continuous Integration (CI). Having expertise working knowledge on Adobe Photoshop CC and Dreamweaver CC. I strongly believe in the power of the Internet, and have an intense desire to learn how to improve the webs core functionality, and to also be involved in its future development. I have a good understand of programming, can come up with plenty of innovative ideas and possess good communication skills.`,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/kathir-favicon.ico' },
      ],
      script: [
        {
          src: 'https://kit.fontawesome.com/df4e4a88c4.js',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxt/eslint', '@nuxt/icon', 'nuxt-auth-utils', 'nuxt-swiper', 'notivue/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: [
    '@/assets/scss/main.scss',
    'vue-flux/style.css',
    'notivue/notification.css', // Only needed if using built-in <Notification />
    'notivue/animations.css', // Only needed if using default animations
  ],
  notivue: {
    position: 'top-right',
    // limit: 4,
    enqueue: true,
    avoidDuplicates: true,
    notifications: {
      global: {
        duration: 5000,
      },
    },
  },
  imports: {
    dirs: [
      './app/composables',
      './app/composables/admin',
    ],
  },
  runtimeConfig: {
    MONGODB_URL: process.env.DB_URI,
    AWSAccessKeyId: process.env.AWSAccessKeyId,
    AWSSecretKey: process.env.AWSSecretKey,
    SESSION_SECRET: process.env.SESSION_SECRET,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.BASE_URL || 'http://localhost:3600',
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
  },
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'iconify-icon',
    },
  },

  nitro: {
    externals: {
      inline: [
        'socks',
        'smart-buffer',
        'mongodb',
        'mongoose',
        'bson',
        'mongodb-connection-string-url',
      ],
    },
    // Prevent circular dependency issues by excluding problematic packages from server build
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    preset: 'node-server',
    node: true,
    // Disable server source maps to avoid path issues
    sourceMap: false,
    // Optimize server bundle
    minify: true,
    // Add prerender routes if needed
    prerender: {
      crawlLinks: false,
    },
    // Shorten output paths to prevent Vercel path length limits
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public',
    },
    rollupConfig: {
      onwarn(warning, warn) {
        // Suppress circular dependency warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY')
          return
        warn(warning)
      },
      output: {
        // Prevent long file paths and null bytes in output
        sanitizeFileName: (name) => {
          // Remove null bytes and other invalid characters
          let sanitizedName = name.replace(/\0/g, '_virtual_')
          // Aggressively shorten file names to prevent path length issues
          if (sanitizedName.length > 50) {
            const ext = sanitizedName.match(/\.[^.]+$/)?.[0] || ''
            const hash = Buffer.from(sanitizedName).toString('base64').substring(0, 8).replace(/[^a-zA-Z0-9]/g, '')
            sanitizedName = `${hash}${ext}`
          }
          return sanitizedName
        },
      },
    },
    // Add hooks to modify output paths
    hooks: {
      'rollup:before': async (nitro) => {
        // This hook runs before rollup builds the server
        console.log('Building Nitro server...')
      },
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/variables.scss" as *;',
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@tiptap/extension-underline',
        '@tiptap/starter-kit',
        '@tiptap/vue-3',
        'slugify', // CJS
        'vue-flux',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-bubble-menu',
        '@tiptap/extension-code-block-lowlight',
        'highlight.js/lib/languages/css',
        'highlight.js/lib/languages/javascript',
        'lowlight',
        '@tiptap/extension-document',
        '@tiptap/core',
        'vue-easy-lightbox',
      ],
      // Exclude Vue from optimization to prevent circular deps
      exclude: [
        'vue',
        '@vue/server-renderer',
        '@vue/compiler-ssr',
        '@vue/compiler-dom',
        '@vue/compiler-core',
        '@vue/shared',
      ],
    },
  },

})
