import { generatePath, Outlet, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import type { HeaderProps } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { NotificationPanel } from '@/shared/ui/NotificationPanel'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearViewed,
  markAllRead,
  selectHasNewNotifications,
  selectNewNotifications,
  selectViewedNotifications,
} from '@/features/exchange/model/exchangeSlice'
import { ROUTES } from '@/shared/lib/constants'
import styles from './MainLayout.module.css'

export const MainLayout = ({
  hasNewNotifications: propHasNewNotifications,
  notificationPanel: propNotificationPanel,
  ...headerProps
}: HeaderProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth?.user)
  const hasNewNotifications = useAppSelector(selectHasNewNotifications)
  const newNotifications = useAppSelector(selectNewNotifications)
  const viewedNotifications = useAppSelector(selectViewedNotifications)

  const handleNotificationGo = (id: string) => {
    const item = [...newNotifications, ...viewedNotifications].find((n) => n.id === id)
    if (item?.skillId) {
      navigate(generatePath(ROUTES.SKILL, { id: item.skillId }))
    }
  }

  const notificationPanel = propNotificationPanel ?? (
    <NotificationPanel
      newItems={newNotifications}
      viewedItems={viewedNotifications}
      onGo={handleNotificationGo}
      onReadAll={() => {
        if (user?.id) dispatch(markAllRead(user.id))
      }}
      onClear={() => {
        if (user?.id) dispatch(clearViewed(user.id))
      }}
    />
  )

  return (
    <div className={styles.layoutContainer}>
      <Header
        hasNewNotifications={propHasNewNotifications ?? hasNewNotifications}
        notificationPanel={notificationPanel}
        {...headerProps}
      />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
