import type { MouseEvent } from 'react'

export interface LikeButtonProps {
  isLiked: boolean
  count?: number
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}
