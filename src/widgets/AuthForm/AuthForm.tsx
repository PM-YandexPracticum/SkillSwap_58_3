import { AuthFormProps } from './interface'
import styles from './AuthForm.module.css'
import { Button } from '@/shared/ui/Button'
import { Divider } from '@/shared/ui/Divider'
import { Input } from '@/shared/ui/Input'
import { Icon } from '@/shared/ui/icons'
import { useState } from 'react'

export const AuthForm = ({ variant, savedValues, onSubmit, errors }: AuthFormProps) => {
  const [formFields, setFormFields] = useState(savedValues)
  const [variantState, setVariantState] = useState(variant)

  const handleChangeField = (value: string, key: string) => {
    setFormFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleChangeAuth = () => {
    setVariantState((prev) => (prev === 'login' ? 'registration' : 'login'))
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
          placeholder={variantState === 'login' ? 'Введите пароль' : 'Придумайте надежный пароль'}
          value={formFields?.password ?? ''}
          hint={variantState === 'registration' ? 'Пароль должен содержать не менее 8 знаков' : ''}
          onChange={({ target }) => handleChangeField(target.value, 'password')}
        />
      </section>

      <section className={styles.bottomSection}>
        <Button onClick={() => onSubmit(formFields)} className={styles.button}>
          {variantState === 'login' ? 'Войти' : 'Далее'}
        </Button>
        <span onClick={handleChangeAuth} className={styles.autoToggleText}>
          {variantState === 'registration' ? 'Уже есть аккаунт? Войти' : 'Зарегистрироваться'}
        </span>
      </section>
    </div>
  )
}
