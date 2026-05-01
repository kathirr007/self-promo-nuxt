/**
 * Component Types
 */

export interface ImageItem {
  location: string
  originalname?: string
}

export interface Experience {
  title: string
  subtitle: string
  slug: string
}

export interface Project {
  _id?: string
  title: string
  subtitle?: string
  slug?: string
  description?: string
  image?: string
  images: ImageItem[]
  wsl?: WslItem[]
  category?: Category
  productLink?: string
  promoVideoLink?: string
  price?: number
  discountedPrice?: number
  status?: string
}

export interface Category {
  _id: string
  name: string
}

export interface WslItem {
  value: string
}

export interface ProjectCardProps {
  project: Project
}

export interface ExperienceCardProps {
  experience: Experience
}

export interface ProjectCardTooltipProps {
  title?: string
  subtitle?: string
  description?: string
  wsl?: WslItem[]
}

export interface ProductHeroCardProps {
  navigateTo?: string
  repoLink?: string
  images?: ImageItem[]
}

export interface MultiLineTextInputProps {
  label: string
  lines: { value: string }[]
  addBtn?: string
}

export interface TextInputWithCountProps {
  maxLength?: number
  v: { $touch: () => void, $invalid: boolean }
  category?: { name: string }
}

export interface UserTileProps {
  name?: string
  avatar?: string
  date?: string
}

export interface ModalProps {
  openTitle?: string
  title?: string
  actionTitle?: string
  removeActionTitle?: string | undefined
  openBtnClass?: string
  showButton?: boolean
  isDisabled?: boolean
}
