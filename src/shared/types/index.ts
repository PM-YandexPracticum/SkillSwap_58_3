// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export type SkillId = string

export interface Skill {
  id: SkillId
  title: string
  description: string
  type: SkillType
  category: CategoryId
  subcategory: SubcategoryId
  tags: string[]
  imageUrl: string | null
  authorId: UserId
  createdAt: string
}

// ─── City ────────────────────────────────────────────────
export type CityId = string
export interface City {
  id: CityId
  name: string
}

// ─── User ────────────────────────────────────────────────
export type Gender = 'male' | 'female' | 'unspecified'
export type UserId = 'string'

export interface User {
  id: UserId
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
  password: string
  town: CityId
  birthday: string
  likedCount: number
  description: string
  gender: Gender
  learn: SubcategoryId[]
  favourites: UserId[]
}

// ─── Request ─────────────────────────────────────────────
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}

// ─── Category ────────────────────────────────────────────
export type SubcategoryId = string

export type CategoryId = string

export interface Subcategory {
  id: SubcategoryId
  name: string
}

export interface Category {
  id: CategoryId
  name: string
  subcategories: Subcategory[]
}

// ─── Checkbox ────────────────────────────────────────────
export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  indeterminate?: boolean
}
