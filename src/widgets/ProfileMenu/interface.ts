export type ProfileMenuItemId = 'requests' | 'exchanges' | 'favorites' | 'skills' | 'personal'

export interface ProfileMenuProps {
  activeItem: ProfileMenuItemId
  onSelect: (id: ProfileMenuItemId) => void
  className?: string
}
