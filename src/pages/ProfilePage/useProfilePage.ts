import { fetchUserById } from '@/api/users'
import {
  getAuthUser,
  getRegisteredUsers,
  saveRegisteredUser,
} from '@/features/auth/model/authUtils'
import { checkSomeFieldsAndReturnError, mapFormDataToUser } from '@/shared/lib/helpers'
import { User } from '@/shared/types'
import { ProfileFormData } from '@/widgets/ProfileEditForm'
import { ProfileMenuItemId } from '@/widgets/ProfileMenu'
import { useCallback, useEffect, useState } from 'react'

export const useProfilePage = () => {
  const [activeItem, setActiveItem] = useState<ProfileMenuItemId>('personal')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsloading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>> | undefined>()

  const handleSave = (formdata: ProfileFormData, isPasswordVisible: boolean) => {
    const registredUsers = getRegisteredUsers()
    const errors = checkSomeFieldsAndReturnError(
      formdata,
      isPasswordVisible,
      registredUsers,
      currentUser?.id,
    )

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
    } else {
      if (currentUser) {
        const mappedUser = mapFormDataToUser(formdata, currentUser)
        saveRegisteredUser(mappedUser)
        setCurrentUser((prev) => (prev ? { ...prev, ...mappedUser } : null))
      }
    }
  }

  const getUser = useCallback(async (currentUserId: string) => {
    try {
      setIsloading(true)
      const user = await fetchUserById(currentUserId)
      setCurrentUser(user || null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsloading(false)
    }
  }, [])

  useEffect(() => {
    const currentUser = getAuthUser()

    if (currentUser) {
      getUser(currentUser.id)
    }
  }, [getUser])

  return {
    activeItem,
    setActiveItem,
    currentUser,
    isLoading,
    setIsloading,
    errors,
    handleSave,
  }
}
