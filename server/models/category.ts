import type { Category } from './types/category'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const categorySchema = new Schema<Category>({
  name: String,
  createdAt: { type: Date, default: Date.now },
})

const CategoryModel = mongoose.model('Category', categorySchema)

export default CategoryModel
