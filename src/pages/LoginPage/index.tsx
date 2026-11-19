import { AuthLayout } from '@/widgets/AuthLayout'
import { AuthForm } from '@/widgets/AuthForm'
import { useAuthRedirect, selectIsAuthorized } from '@/features/auth'
import { useState, useEffect } from 'react'
import type { AppDispatch } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { ROUTES } from '@/shared/lib/constants'
import { useNavigate } from 'react-router-dom'
import type { AuthFormValues } from '@/widgets/AuthForm/interface'
import { loginUser } from '@/features/auth/model/authSlice'
import { selectAuthError } from '@/features/auth/model/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const isAuthed = useSelector(selectIsAuthorized)
  const redirectBack = useAuthRedirect()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthed) {
      navigate(ROUTES.HOME, { replace: true })
    }
  }, [isAuthed, navigate])

  const handleClose = () => {
    navigate(ROUTES.HOME)
  }

  const [savedValues, setSavedValues] = useState({ email: '', password: '' })

  const handleSubmit = ({ email = '', password = '' }: Partial<AuthFormValues>) => {
    setSavedValues({ email, password: '' })
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => redirectBack())
      .catch(() => {})
  }

  const error = useSelector(selectAuthError)

  return (
    <AuthLayout
      image="light-bulb"
      alt="bell-img"
      variant="registration"
      title="Добро пожаловать в SkillSwap!"
      description="Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
      onClose={handleClose}
    >
      <AuthForm
        onSubmit={handleSubmit}
        savedValues={savedValues}
        variant="login"
        errors={error ? { password: error } : undefined}
      />
    </AuthLayout>
  )
}
