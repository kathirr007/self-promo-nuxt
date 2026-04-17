const { Nuxt } = require('nuxt')
const config = require('../nuxt.config.js')

// Set production mode for Vercel
config.dev = false

let nuxt

const initNuxt = async () => {
  if (!nuxt) {
    nuxt = new Nuxt(config)
    await nuxt.ready()
  }
  return nuxt
}

module.exports = async (req, res) => {
  const nuxtInstance = await initNuxt()
  await nuxtInstance.render(req, res)
}