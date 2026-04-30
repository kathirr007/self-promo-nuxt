import type { ObjectId } from 'mongoose'

export interface ProjectHero {
  project: ObjectId
  image: string
  title: string
  subtitle: string
  createdAt: Date
}
