import { Link } from 'react-router-dom'
import { AuthFormProps } from './interface'
import styles from './AuthForm.module.css'
import { Button } from '@/shared/ui/Button'
import { Divider } from '@/shared/ui/Divider'
import { Input } from '@/shared/ui/Input'
import { Icon } from '@/shared/ui/icons'
import { ROUTES } from '@/shared/lib/constants'
import { useState } from 'react'

export const AuthForm = ({ variant, savedValues, onSubmit, errors }: AuthFormProps) => {
  const [formFields, setFormFields] = useState(savedValues)
  const isLogin = variant === 'login'

  const handleChangeField = (value: string, key: string) => {
    setFormFields((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className={styles.formContainer}>
      <section className={styles.buttonSection}>
        <Button variant="outline" iconLeft={<Icon name="google" />}>
          Продолжить с Google
        </Button>
        <Button variant="outline" iconLeft={<Icon name="apple" />}>
          Продолжить с Apple
        </Button>
      </section>

      <Divider text="или" />

      <section className={styles.buttonSection}>
        <Input
          error={errors?.email}
          label="Email"
          placeholder="Введите email"
          value={formFields?.email ?? ''}
          onChange={({ target }) => handleChangeField(target.value, 'email')}
        />
        <Input
          error={errors?.password}
          type="password"
          label="Пароль"
          placeholder={isLogin ? 'Введите пароль' : 'Придумайте надежный пароль'}
          value={formFields?.password ?? ''}
          hint={isLogin ? '' : 'Пароль должен содержать не менее 8 знаков'}
          onChange={({ target }) => handleChangeField(target.value, 'password')}
        />
      </section>

      <section className={styles.bottomSection}>
        <Button onClick={() => onSubmit(formFields)} className={styles.button}>
          {isLogin ? 'Войти' : 'Далее'}
        </Button>
        {isLogin ? (
          <Link to={ROUTES.REGISTER} className={styles.autoToggleText}>
            Зарегистрироваться
          </Link>
        ) : (
          <Link to={ROUTES.LOGIN} className={styles.autoToggleText}>
            Уже есть аккаунт? Войти
          </Link>
        )}
      </section>
    </div>
  )
}
