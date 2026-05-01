import type { Experience } from './types/experience'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const experienceSchema = new Schema<Experience>({
  slug: { type: String, unique: true, sparse: true },
  title: { type: String, maxlength: 96 },
  subtitle: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted', 'published'],
    default: 'active',
  },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
})

experienceSchema.virtual('User', {
  ref: 'User',
  localField: 'author',
  foreignField: 'uid',
})

const ExperienceModel = mongoose.model('Experience', experienceSchema)

export default ExperienceModel
