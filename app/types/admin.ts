/**
 * Admin Component Types
 */

import type { Category, ImageItem, WslItem } from './components'

export interface AdminProject {
  title: string
  subtitle?: string
  description?: string
  category: Category
  images: ImageItem[]
  productLink?: string
  promoVideoLink?: string
  price?: number
  discountedPrice?: number
  status?: string
  wsl?: WslItem[]
}

export interface LandingPageProps {
  project: AdminProject
}

export interface LandingPageEmits {
  projectValueUpdated: [{ value: unknown, field: string }]
  projectImageUpdated: [{ index: number, field: string }]
}

export interface PriceProps {
  project: { price?: number, discountedPrice?: number }
}

export interface PriceEmits {
  projectValueUpdated: [{ value: string, field: string }]
}

export interface StatusProps {
  project: { status?: string }
}

export interface StatusEmits {
  projectValueUpdated: [{ value: string, field: string }]
}

export interface TechnologiesUsedProps {
  project: { wsl: WslItem[] }
}

export interface ProjectCreateStep1Props {
  category?: Category | null
  canProceed?: boolean
}

export interface ProjectCreateStep1Emits {
  stepUpdated: [{ data: { title: string }, isValid: boolean }]
  fromCategories: [{ data: { title: string }, isValid: boolean }]
  goNext: []
}
