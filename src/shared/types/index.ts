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
  images: string[]
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
export type UserId = string

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

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends LoginCredentials {
  name: string
  birthday: string
  gender: Gender
  town: CityId
  learn: SubcategoryId[]
  avatarUrl?: string | null
  description?: string
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

// ─── NotificationItem  ────────────────────────────────────────
export interface NotificationItem {
  id: string
  text: string
  description: string
  dateLabel: string
}
