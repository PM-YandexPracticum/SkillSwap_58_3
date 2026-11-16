import { ProfileMenu } from '@/widgets/ProfileMenu'
import { ProfileEditForm } from '@/widgets/ProfileEditForm'
import styles from './ProfilePage.module.css'
import { useState, useEffect } from 'react'
import { fetchUserById } from '@/api/users'
import { Loader } from '@/shared/ui/Loader'
import type { User } from '@/shared/types'
import type { ProfileMenuItemId } from '@/widgets/ProfileMenu'
import type { ProfileFormData } from '@/widgets/ProfileEditForm'

export default function ProfilePage() {
  const [activeItem, setActiveItem] = useState<ProfileMenuItemId>('personal')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsloading] = useState(true)

  const handleSave = (formdata: ProfileFormData) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...formdata } : null))
  }

  useEffect(() => {
    fetchUserById('user-02')
      .then((user) => {
        setCurrentUser(user || null)
      })
      .finally(() => {
        setIsloading(false)
      })
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className={styles.main}>
      <ProfileMenu activeItem={activeItem} onSelect={setActiveItem} />
      {activeItem === 'personal' ? (
        currentUser && <ProfileEditForm currentUser={currentUser} onSave={handleSave} />
      ) : (
        <div>Раздел в разработке</div>
      )}
    </section>
  )
}
