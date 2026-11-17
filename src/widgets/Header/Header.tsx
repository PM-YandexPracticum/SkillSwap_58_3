import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ROUTES } from '@/shared/lib/constants'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Dropdown } from '@/shared/ui/Dropdown'
import { Icon } from '@/shared/ui/icons'
import { Logo } from '@/shared/ui/Logo'
import { NotificationButton } from '@/shared/ui/NotificationButton'
import { SearchInput } from '@/shared/ui/SearchInput'
import type { HeaderProps } from './interface'
import styles from './Header.module.css'
import { getAuthUser } from '@/features/auth/model/authUtils'

const HEADER_LINKS = {
  about: '/about',
  favorites: ROUTES.FAVORITES,
  profile: ROUTES.PROFILE,
} as const

const HEADER_LABELS = {
  about: 'О проекте',
  skills: 'Все навыки',
  searchPlaceholder: 'Искать навык',
  login: 'Войти',
  register: 'Зарегистрироваться',
  profile: 'Личный кабинет',
  logout: 'Выйти из аккаунта',
} as const

export const Header = ({
  isAuthorized,
  name,
  avatarUrl,
  hasNewNotifications = false,
  searchValue,
  onSearchChange,
  onSearch,
  onLogin,
  onRegister,
  onLogout,
  notificationPanel,
  skillsMenu,
}: HeaderProps) => {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    setIsProfileOpen(false)
    onLogout?.()
  }

  const nameLocal = getAuthUser()?.name ?? name

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />

        <nav className={styles.nav} aria-label="Основная навигация">
          <Link to={HEADER_LINKS.about} className={styles.navLink}>
            {HEADER_LABELS.about}
          </Link>

          <Dropdown
            isOpen={isSkillsOpen}
            onClose={() => setIsSkillsOpen(false)}
            panelClassName={styles.skillsPanel}
            ariaLabel="Меню навыков"
            trigger={
              <Button
                variant="link"
                className={clsx(styles.skillsTrigger, isSkillsOpen && styles.skillsTriggerOpen)}
                iconRight={<Icon name={isSkillsOpen ? 'chevron-up' : 'chevron-down'} size={24} />}
                onClick={() => setIsSkillsOpen((prev) => !prev)}
              >
                {HEADER_LABELS.skills}
              </Button>
            }
          >
            {skillsMenu}
          </Dropdown>
        </nav>

        <div className={styles.search}>
          <SearchInput
            value={searchValue}
            placeholder={HEADER_LABELS.searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            onSearch={() => onSearch?.()}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.iconButton} aria-label="Переключить тему">
            <Icon name="moon" size={24} />
          </button>

          {isAuthorized ? (
            <>
              <Dropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                ariaLabel="Уведомления"
                trigger={
                  <NotificationButton
                    hasNew={hasNewNotifications}
                    onClick={() => setIsNotificationsOpen((prev) => !prev)}
                  />
                }
              >
                {notificationPanel}
              </Dropdown>

              <Link
                to={HEADER_LINKS.favorites}
                className={styles.iconButton}
                aria-label="Избранное"
              >
                <Icon name="heart" size={24} />
              </Link>

              <Dropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                ariaLabel="Меню профиля"
                trigger={
                  <button
                    type="button"
                    className={styles.profileTrigger}
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                  >
                    {name && <span className={styles.userName}>{nameLocal}</span>}
                    <Avatar size="small" src={avatarUrl} alt={nameLocal ?? 'Профиль'} />
                  </button>
                }
              >
                <div className={styles.profileMenu}>
                  <Link
                    to={HEADER_LINKS.profile}
                    className={styles.profileMenuItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {HEADER_LABELS.profile}
                  </Link>
                  <button type="button" className={styles.profileMenuItem} onClick={handleLogout}>
                    <span>{HEADER_LABELS.logout}</span>
                    <Icon name="logout" size={24} />
                  </button>
                </div>
              </Dropdown>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Button variant="outline" onClick={onLogin}>
                {HEADER_LABELS.login}
              </Button>
              <Button variant="primary" onClick={onRegister}>
                {HEADER_LABELS.register}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
