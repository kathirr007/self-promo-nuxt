import type { Document, Model } from 'mongoose'
import slugify from 'slugify'

/**
 * Generates a unique slug by checking the database for existing slugs
 * and appending incremental numbers if duplicates are found
 * 
 * @param title - The title to convert to a slug
 * @param model - The Mongoose model to check for existing slugs
 * @param currentId - Optional ID to exclude from the check (for updates)
 * @param slugField - The field name to check (defaults to 'slug')
 * @returns A unique slug string
 */
export async function generateUniqueSlug(
  title: string,
  model: Model<any>,
  currentId?: string,
  slugField: string = 'slug',
): Promise<string> {
  const baseSlug = slugify(title, {
    replacement: '-',
    lower: true,
  })

  let slug = baseSlug
  let counter = 1
  let exists = true

  // Check if slug exists, excluding current document when updating
  while (exists) {
    const existingDocument = await model.findOne({
      [slugField]: slug,
      ...(currentId && { _id: { $ne: currentId } }),
    })

    if (!existingDocument) {
      exists = false
    }
    else {
      slug = `${baseSlug}-${counter}`
      counter++
    }
  }

  return slug
}
