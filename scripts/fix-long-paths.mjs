#!/usr/bin/env node

/**
 * Post-build script to fix long file paths in .output directory
 * This addresses Vercel's 949-byte path length limit issue with pnpm symlinks
 */

import { readdirSync, statSync, renameSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const OUTPUT_DIR = join(__dirname, '..', '.output')
const MAX_PATH_LENGTH = 900 // Leave some buffer below 949

/**
 * Recursively find and fix long paths
 */
function fixLongPaths(dir = OUTPUT_DIR) {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      fixLongPaths(fullPath)
    }
    else if (entry.isFile()) {
      // Check if path exceeds limit
      if (fullPath.length > MAX_PATH_LENGTH) {
        console.warn(`⚠️  Long path detected (${fullPath.length} bytes): ${fullPath}`)

        // Generate a shorter name by hashing or truncating
        const ext = entry.name.includes('.') ? `.${entry.name.split('.').pop()}` : ''
        const hash = Buffer.from(fullPath).toString('base64').substring(0, 16).replace(/[^a-zA-Z0-9]/g, '_')
        const shortName = `${hash}${ext}`
        const newFullPath = join(dir, shortName)

        try {
          renameSync(fullPath, newFullPath)
          console.log(`✓ Renamed: ${entry.name} → ${shortName}`)
        }
        catch (error) {
          console.error(`✗ Failed to rename: ${fullPath}`, error.message)
        }
      }
    }
  }
}

console.log('🔧 Running post-build path fixer...')
console.log(`Output directory: ${OUTPUT_DIR}`)

try {
  fixLongPaths()
  console.log('✅ Path fixer completed successfully')
}
catch (error) {
  console.error('❌ Path fixer failed:', error)
  process.exit(1)
}
