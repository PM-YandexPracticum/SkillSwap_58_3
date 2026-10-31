// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  title: string
  description: string
  type: SkillType
  category: string
  tags: string[]
  imageUrl: string | null
  authorId: string
  createdAt: string
}

// ─── City ────────────────────────────────────────────────
export type cityId = string
export interface City {
  id: cityId
  name: string
}

// ─── User ────────────────────────────────────────────────
export type Gender = 'male' | 'female' | 'unspecified'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
  login: string
  password: string
  town: string
  age: string
  likedCount: number
  description: string
  gender: Gender
  learn: string[]
  canTeach: Skill
  favorites: User[]
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
