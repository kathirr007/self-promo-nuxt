// api/index.js
const { createServer } = require('http')
const app = require('../server/routes/index') // adjust path if needed

module.exports = (req, res) => {
  // If your server/routes/index exports an express/nuxt handler:
  return app.handler(req, res)
}
