import { createRequire } from 'node:module'
import mongoose from 'mongoose'

// Polyfill require for MongoDB driver in ESM environment
if (typeof globalThis.require === 'undefined') {
  const require = createRequire(import.meta.url)
  globalThis.require = require
}

export default defineNitroPlugin(async () => {
  const URL = useRuntimeConfig().MONGODB_URL
  await mongoose.connect(URL)
  console.log('Successfully Connected to MongoDB..!')
})
