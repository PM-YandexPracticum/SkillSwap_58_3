import React from 'react'

export interface LikeButtonProps {
  isLiked: boolean
  count?: number
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}
