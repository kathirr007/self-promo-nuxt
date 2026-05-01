import type { Project } from './types/project'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const projectSchema = new Schema<Project>({
  slug: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  subtitle: String,
  image: String,
  storageLocation: String,
  storageLocationNew: { type: String, default: null },
  images: Array,
  description: { type: String, default: '' },
  rating: Number,
  // what students learn
  wsl: [{ type: Schema.Types.Mixed, value: String }],
  requirements: [{ type: Schema.Types.Mixed, value: String }],
  promoVideoLink: String,
  projectLink: String,
  // githubLink: String,
  price: Number,
  discountedPrice: Number,
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted', 'published'],
    default: 'active',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
})

projectSchema.virtual('User', {
  ref: 'User',
  localField: 'author',
  foreignField: 'uid',
})

projectSchema.virtual('Category', {
  ref: 'Category',
  localField: 'category',
  foreignField: 'uid',
})

const ProjectModel = mongoose.model('Project', projectSchema)

export default ProjectModel
