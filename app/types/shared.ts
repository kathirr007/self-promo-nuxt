/**
 * Shared Component Types
 */

export interface Hero {
  title: string
  subtitle: string
  image?: string
  project: { slug: string } | null
}

export interface HeroSliderProps {
  heroes?: Hero[]
  title?: string
  subtitle?: string
  image?: string
}

export interface HeaderProps {
  title: string
  exitLink?: string | null
}

export interface DropdownItem {
  name: string
  command: string
}

export interface DropdownProps {
  items: DropdownItem[]
}

export interface IconSize {
  size?: 'small' | 'normal' | 'large'
}

export interface IconProps {
  name?: string
  size?: 'small' | 'normal' | 'large'
}

export interface Navbar {
  isActive: boolean
}
