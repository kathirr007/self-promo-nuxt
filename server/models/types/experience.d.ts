import type { ObjectId } from 'mongoose'

export enum ExperienceStatus {
  active,
  inactive,
  deleted,
  published,
}

export interface Experience {
  slug: string
  title: string
  subtitle: string
  content: string
  createdAt: Date
  updatedAt: Date
  featured: boolean
  status: string
  author: ObjectId
}
