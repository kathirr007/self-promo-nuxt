import type { ObjectId } from 'mongoose'

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  PUBLISHED = 'published',
}

export interface Product {
  _id?: string
  slug: string
  title: string
  subtitle: string
  image: string
  storageLocation: string
  storageLocationNew: string
  images: string[]
  description: string
  rating: number
  // what students learn
  wsl: string[] | any[]
  requirements: string[] | any[]
  promoVideoLink: string
  productLink: string
  // githubLink: String;
  price: number
  discountedPrice: number
  status: string
  createdAt: Date
  updatedAt: Date
  category: ObjectId
  author: ObjectId
}
