export {}

import type * as T from './index'

declare global {
  type Hero = T.Hero
  type HeroSliderProps = T.HeroSliderProps
  type HeaderProps = T.HeaderProps
  type DropdownItem = T.DropdownItem
  type DropdownProps = T.DropdownProps
  type IconSize = T.IconSize
  type IconProps = T.IconProps
  type Navbar = T.Navbar

  type ImageItem = T.ImageItem
  type Experience = T.Experience
  type Project = T.Project
  type Category = T.Category
  type WslItem = T.WslItem
  type ProjectCardProps = T.ProjectCardProps
  type ExperienceCardProps = T.ExperienceCardProps
  type ProjectCardTooltipProps = T.ProjectCardTooltipProps
  type ProductHeroCardProps = T.ProductHeroCardProps
  type MultiLineTextInputProps = T.MultiLineTextInputProps
  type TextInputWithCountProps = T.TextInputWithCountProps
  type UserTileProps = T.UserTileProps
  type ModalProps = T.ModalProps

  type AdminProject = T.AdminProject
  type LandingPageProps = T.LandingPageProps
  type LandingPageEmits = T.LandingPageEmits
  type PriceProps = T.PriceProps
  type PriceEmits = T.PriceEmits
  type StatusProps = T.StatusProps
  type StatusEmits = T.StatusEmits
  type TechnologiesUsedProps = T.TechnologiesUsedProps
  type ProjectCreateStep1Props = T.ProjectCreateStep1Props
  type ProjectCreateStep1Emits = T.ProjectCreateStep1Emits

  type Command = T.Command
  type DropdownOption = T.DropdownOption

  // Auth types
  type SessionUser = T.SessionUser
}
