import clsx from 'clsx'
import { Icon, type IconName } from '@/shared/ui/icons'
import type { ProfileMenuItemId, ProfileMenuProps } from './interface'
import styles from './ProfileMenu.module.css'

interface MenuItemConfig {
  id: ProfileMenuItemId
  label: string
  icon: IconName
}

const MENU_ITEMS: MenuItemConfig[] = [
  { id: 'requests', label: 'Заявки', icon: 'request' },
  { id: 'exchanges', label: 'Мои обмены', icon: 'message-text' },
  { id: 'favorites', label: 'Избранное', icon: 'heart' },
  { id: 'skills', label: 'Мои навыки', icon: 'bulb' },
  { id: 'personal', label: 'Личные данные', icon: 'user' },
]

export const ProfileMenu = ({ activeItem, onSelect, className }: ProfileMenuProps) => {
  return (
    <nav className={clsx(styles.menu, className)} aria-label="Меню профиля">
      {MENU_ITEMS.map((item) => {
        const isActive = item.id === activeItem

        return (
          <button
            key={item.id}
            type="button"
            className={clsx(styles.item, isActive && styles.active)}
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.icon}>
              <Icon name={item.icon} size={24} aria-hidden />
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
