import { useEffect, useState } from 'react'
import { generatePath, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserById } from '@/api/users'
import { logout, selectAuthUser, selectIsAuthorized } from '@/features/auth'
import { getRegisteredUsers } from '@/features/auth/model/authUtils'
import {
  clearViewed,
  markAllRead,
  selectHasNewNotifications,
  selectNewNotifications,
  selectViewedNotifications,
} from '@/features/exchange/model/exchangeSlice'
import { ROUTES } from '@/shared/lib/constants'
import { NotificationPanel } from '@/shared/ui/NotificationPanel'
import { Footer } from '@/widgets/Footer'
import { Header } from '@/widgets/Header'
import { SkillsMenu } from '@/widgets/SkillsMenu'
import type { HeaderProps } from '@/widgets/Header'
import type { AppDispatch } from '@/store'
import styles from './MainLayout.module.css'

export interface MainLayoutProps extends Partial<HeaderProps> {
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export const MainLayout = ({
  searchValue = '',
  onSearchChange = () => {},
  ...restProps
}: MainLayoutProps) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const isAuthorized = useSelector(selectIsAuthorized)
  const authUser = useSelector(selectAuthUser)
  const hasNewNotifications = useSelector(selectHasNewNotifications)
  const newNotifications = useSelector(selectNewNotifications)
  const viewedNotifications = useSelector(selectViewedNotifications)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!authUser?.id) {
      setAvatarUrl(undefined)
      return
    }

    const localUser = getRegisteredUsers().find((user) => user.id === authUser.id)
    if (localUser?.avatarUrl) {
      setAvatarUrl(localUser.avatarUrl)
      return
    }

    let isMounted = true
    fetchUserById(authUser.id)
      .then((user) => {
        if (isMounted && user?.avatarUrl) {
          setAvatarUrl(user.avatarUrl)
        }
      })
      .catch(() => {
        // если аватар не найден в каталоге, остаётся дефолтная заглушка
      })

    return () => {
      isMounted = false
    }
  }, [authUser?.id])

  const handleLogin = () => {
    navigate(ROUTES.LOGIN)
  }

  const handleRegister = () => {
    navigate(ROUTES.REGISTER)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.HOME)
  }

  const handleNotificationGo = (id: string) => {
    const item = [...newNotifications, ...viewedNotifications].find((n) => n.id === id)
    if (item?.skillId) {
      navigate(generatePath(ROUTES.SKILL, { id: item.skillId }))
    }
  }

  const notificationPanel = restProps.notificationPanel ?? (
    <NotificationPanel
      newItems={newNotifications}
      viewedItems={viewedNotifications}
      onGo={handleNotificationGo}
      onReadAll={() => {
        if (authUser?.id) dispatch(markAllRead(authUser.id))
      }}
      onClear={() => {
        if (authUser?.id) dispatch(clearViewed(authUser.id))
      }}
    />
  )

  return (
    <div className={styles.layoutContainer}>
      <Header
        isAuthorized={isAuthorized}
        name={authUser?.name}
        avatarUrl={avatarUrl}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        hasNewNotifications={restProps.hasNewNotifications ?? hasNewNotifications}
        notificationPanel={notificationPanel}
        skillsMenu={(closeMenu) => <SkillsMenu onSelect={closeMenu} />}
        {...restProps}
      />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
