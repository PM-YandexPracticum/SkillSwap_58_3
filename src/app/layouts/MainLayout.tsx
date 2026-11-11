import { Header } from '@/widgets/Header'
import type { HeaderProps } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { Outlet } from 'react-router-dom'
import styles from './MainLayout.module.css'

export const MainLayout = ({ ...headerProps }: HeaderProps) => {
  return (
    <div className={styles.layoutContainer}>
      <Header {...headerProps} />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
