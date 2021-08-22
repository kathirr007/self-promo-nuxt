import Sass from "sass";
import Fiber from "fibers";

import HtmlCriticalWebpackPlugin from "html-critical-webpack-plugin";
import path from "path";

export default {
  server: {
    // port: 3100, // default 3000
    port: process.env.PORT || 3600
  },
  // mode: 'universal',
  /*
   ** Disable Nuxt asking for participation
   */
  telemetry: false,
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: "en"
    },
    bodyAttrs: {
      lang: "en"
    },
    title: `Kathiravan K | Sr.UI Developer | Portfolio`,
    meta: [
      { charset: "utf-8" },
      {
        name: "google-site-verification",
        content: "w4IPzZUmq92f1hdY9DpTVfDBF67pwaNGZpvNxGqmVHU"
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      },
      {
        hid: "og:title",
        name: "og:title",
        content: "Kathiravan K | Sr.UI Developer"
      },
      { hid: "og:locale", name: "og:locale", content: "en_US" },
      {
        hid: "og:url",
        name: "og:url",
        content: process.env.BASE_URL || "http://localhost:3600"
      },
      { hid: "og:type", name: "og:type", content: "website" },
      {
        hid: "og:image",
        name: "og:image",
        content:
          "https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80"
      },
      {
        hid: "og:description",
        name: "og:description",
        content: `My Name is Kathiravan K, and I'm an Sr.UI Developer with a strong working experience in web technologies`
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/kathir-favicon.ico" }
      // { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css' }
      // { rel: 'stylesheet', type: 'text/css', href: 'https://unpkg.com/bulma-modal-fx/dist/css/modal-fx.min.css' }
      // { rel: "stylesheet", type: "text/css", href: "https://use.fontawesome.com/releases/v5.15.1/css/all.css"}
    ],
    script: [
      {
        src: "https://kit.fontawesome.com/df4e4a88c4.js",
        crossorigin: "anonymous"
      }
      // {src: 'https://unpkg.com/bulma-modal-fx/dist/js/modal-fx.min.js', crossorigin :'anonymous'}
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#4bacff" },
  /*
   ** Global CSS
   */
  css: ["@assets/scss/main.scss"],
  /* Style resources */
  styleResources: {
    // your settings here
    sass: [],
    scss: ["@assets/scss/variables.scss"],
    less: [],
    stylus: []
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/filters" },
    { src: "~/plugins/vuelidate" },
    { src: "~/plugins/integrations" },
    { src: "~/plugins/components" },
    { src: "~/plugins/tooltip" },
    // {src: '~/plugins/jquery', ssr: false},
    // {src: '~/plugins/bootstrapSelect', ssr: false},
    { src: "~/plugins/toasted", ssr: false },
    { src: "~/plugins/paginate", ssr: false },
    { src: "~/plugins/infiniteloading", ssr: false },
    // {src: '~/plugins/vueModal', ssr:false},
    { src: "~/plugins/vueConfirm", ssr: false },
    { src: "~/plugins/vuePictureSwipe", ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "portal-vue/nuxt",
    "@nuxtjs/style-resources",
    "@nuxtjs/auth"
    // '@nuxtjs/vuetify',
    // 'nuxt-oauth',
  ],
  /* Auth module configurations */
  auth: {
    strategies: {
      google: {
        // _scheme: 'oauth2',
        // authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
        // userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
        // scope: ['openid', 'profile', 'email'],
        // access_type: undefined,
        // access_token_endpoint: undefined,
        // response_type: 'token',
        // token_type: 'Bearer',
        // redirect_uri: 'http://localhost:3600',
        client_id:
          "952132017083-to68rg93dp9ao68ulhim23853vhc3hvq.apps.googleusercontent.com"
        // token_key: 'access_token',
        // state: 'UNIQUE_AND_NON_GUESSABLE'
      }
    },
    redirect: {
      // login: '/',
      logout: "/login",
      callback: "/callback"
      // home: '/',
    }
  },
  /* OAuth module configs */
  /*   oauth: {
        sessionName: 'mySession',
        secretKey: process.env.SECRET_KEY,
        oauthHost: process.env.OAUTH_HOST,
        oauthClientID: process.env.OAUTH_CLIENT_ID,
        oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
        onLogout: (req, res) => {
          // do something after logging out
        },
        fetchUser: (accessToken, request) => {
          // do something to return the user
          const user = User.findByToken(accessToken, request)
          return user
        }
      }, */
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.BASE_URL || "http://localhost:3600"
  },
  /* server Middleware */
  serverMiddleware: ["~/server/routes/index"],
  /* server Middleware end */
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient, isServer, isDev }) {
      // if (process.env.NODE_ENV === "production") {
      //   config.plugins.push(
      //     new HtmlCriticalWebpackPlugin({
      //       base: path.resolve(__dirname, "dist"),
      //       src: "index.html",
      //       dest: "index.html",
      //       inline: true,
      //       minify: true,
      //       extract: true,
      //       width: 375,
      //       height: 565,
      //       penthouse: {
      //         blockJSRequests: false
      //       }
      //     })
      //   );
      // }
    },
    // extractCSS: {
    //   ignoreOrder: false
    // },
    loaders: {
      scss: {
        implementation: Sass,
        sassOptions: {
          fiber: Fiber
        }
      }
    }
  }
};
