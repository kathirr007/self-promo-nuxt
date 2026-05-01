import type { ProjectHero } from './types/project-hero'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const projectHeroSchema = new Schema<ProjectHero>({
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  image: String,
  title: String,
  subtitle: String,
  createdAt: { type: Date, default: Date.now },
})

projectHeroSchema.virtual('Project', {
  ref: 'Project',
  localField: 'project',
  foreignField: 'uid',
})

const ProjectHeroModel = mongoose.model('ProjectHero', projectHeroSchema)

export default ProjectHeroModel
