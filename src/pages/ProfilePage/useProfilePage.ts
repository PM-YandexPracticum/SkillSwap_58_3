import { fetchUserById } from '@/api/users'
import {
  getAuthUser,
  getRegisteredUsers,
  saveAuthUser,
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
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>> | undefined>()

  const handleSave = (formData: ProfileFormData, isPasswordVisible: boolean) => {
    if (!currentUser) return

    const registeredUsers = getRegisteredUsers()

    const validationErrors = checkSomeFieldsAndReturnError(
      formData,
      isPasswordVisible,
      registeredUsers,
      currentUser.id,
    )

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors(undefined)

    const mappedUser = mapFormDataToUser(formData, currentUser)

    saveRegisteredUser(mappedUser)
    saveAuthUser({ id: mappedUser.id, name: mappedUser.name, email: mappedUser.email })
    setCurrentUser(mappedUser)
  }

  const getUser = useCallback(async (currentUserId: string) => {
    try {
      setIsLoading(true)
      const user = await fetchUserById(currentUserId)
      setCurrentUser(user ?? null)
    } catch {
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const authUser = getAuthUser()

    if (authUser) {
      getUser(authUser.id)
    }
  }, [getUser])

  return {
    activeItem,
    setActiveItem,
    currentUser,
    isLoading,
    errors,
    handleSave,
  }
}
