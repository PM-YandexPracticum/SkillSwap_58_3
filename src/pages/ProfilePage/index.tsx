import { ProfileMenu } from '@/widgets/ProfileMenu'
import { ProfileEditForm } from '@/widgets/ProfileEditForm'
import styles from './ProfilePage.module.css'
import { Loader } from '@/shared/ui/Loader'
import { useProfilePage } from '@/pages/ProfilePage/useProfilePage'

export default function ProfilePage() {
  const {
    activeItem,
    currentUser,
    errors,
    handleSave,
    handleAvatarChange,
    isLoading,
    setActiveItem,
  } = useProfilePage()

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className={styles.main}>
      <ProfileMenu activeItem={activeItem} onSelect={setActiveItem} />
      {activeItem === 'personal' ? (
        currentUser && (
          <ProfileEditForm
            errors={errors}
            currentUser={currentUser}
            onSave={handleSave}
            onAvatarChange={handleAvatarChange}
          />
        )
      ) : (
        <div>Раздел в разработке</div>
      )}
    </section>
  )
}
