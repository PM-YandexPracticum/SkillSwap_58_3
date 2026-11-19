import { useEffect, useState, type FormEvent } from 'react'
import clsx from 'clsx'
import type { Gender } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { DatePicker } from '@/shared/ui/DatePicker'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import type { ProfileEditFormProps, ProfileFormData } from './interface'
import styles from './ProfileEditForm.module.css'

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
  { value: 'unspecified', label: 'Не указан' },
]

const DEFAULT_CITIES: SelectOption[] = [
  { value: 'moscow', label: 'Москва' },
  { value: 'saint-petersburg', label: 'Санкт-Петербург' },
  { value: 'novosibirsk', label: 'Новосибирск' },
  { value: 'yekaterinburg', label: 'Екатеринбург' },
  { value: 'kazan', label: 'Казань' },
  { value: 'omsk', label: 'Омск' },
  { value: 'rostov-on-don', label: 'Ростов-на-Дону' },
  { value: 'volgograd', label: 'Волгоград' },
]

const parseDate = (val?: string): Date | null => {
  if (!val) return null
  if (val.includes('.')) {
    const [d, m, y] = val.split('.').map(Number)
    if (d && m && y) return new Date(y, m - 1, d)
  }
  const date = new Date(val)
  return isNaN(date.getTime()) ? null : date
}

const formatDate = (date: Date | null): string => {
  if (!date) return ''
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}

export const ProfileEditForm = ({
  currentUser,
  errors,
  onSave,
  cityOptions = DEFAULT_CITIES,
  className,
}: ProfileEditFormProps) => {
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [name, setName] = useState(currentUser?.name ?? '')
  const [birthday, setBirthday] = useState<Date | null>(parseDate(currentUser?.birthday))
  const [gender, setGender] = useState<Gender>(currentUser?.gender ?? 'female')
  const [town, setTown] = useState(currentUser?.town ?? 'moscow')
  const [description, setDescription] = useState(currentUser?.description ?? '')
  const [password, setPassword] = useState('')

  const [isPasswordBlockVisible, setIsPasswordBlockVisible] = useState(false)
  const [isEditable, setIsEditable] = useState({
    email: false,
    name: false,
    description: false,
  })

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email ?? '')
      setName(currentUser.name ?? '')
      setBirthday(parseDate(currentUser.birthday))
      setGender(currentUser.gender ?? 'female')
      setDescription(currentUser.description ?? '')

      if (currentUser.town) {
        const matched = cityOptions.find(
          (c) =>
            c.value === currentUser.town ||
            c.label.toLowerCase() === currentUser.town.toLowerCase(),
        )
        setTown(matched ? matched.value : currentUser.town)
      }
    }
  }, [currentUser, cityOptions])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData: ProfileFormData = {
      email,
      name,
      birthday: formatDate(birthday),
      gender,
      town,
      description,
      password: '',
    }

    if (isPasswordBlockVisible && password) {
      formData.password = password
    }

    if (formData) {
      onSave(formData, isPasswordBlockVisible)
    }
  }

  return (
    <form className={clsx(styles.form, className)} onSubmit={handleSubmit} noValidate>
      <FormField
        id="profile-email"
        label="Почта"
        error={errors?.email}
        className={clsx(styles.fieldWrapper, errors?.email && styles.hasError)}
      >
        <Input
          id="profile-email"
          label=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          iconRight="edit"
          readOnly={!isEditable.email}
          onRightIconClick={() => setIsEditable((prev) => ({ ...prev, email: !prev.email }))}
        />
      </FormField>

      <Button
        variant="link"
        type="button"
        className={styles.passwordToggle}
        onClick={() => setIsPasswordBlockVisible((prev) => !prev)}
      >
        Изменить пароль
      </Button>

      {isPasswordBlockVisible && (
        <FormField
          id="profile-password"
          label="Пароль"
          error={errors?.password}
          className={clsx(styles.fieldWrapper, errors?.password && styles.hasError)}
        >
          <Input
            id="profile-password"
            label=""
            type="password"
            placeholder="Введите новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
      )}

      <FormField
        id="profile-name"
        label="Имя"
        error={errors?.name}
        className={clsx(styles.fieldWrapper, errors?.name && styles.hasError)}
      >
        <Input
          id="profile-name"
          label=""
          value={name}
          onChange={(e) => setName(e.target.value)}
          iconRight="edit"
          readOnly={!isEditable.name}
          onRightIconClick={() => setIsEditable((prev) => ({ ...prev, name: !prev.name }))}
        />
      </FormField>

      <div className={styles.row}>
        <FormField
          id="profile-birthday"
          label="Дата рождения"
          error={errors?.birthday}
          className={clsx(styles.fieldWrapper, errors?.birthday && styles.hasError)}
        >
          <DatePicker label="" value={birthday} onChange={setBirthday} placeholder="дд.мм.гггг" />
        </FormField>

        <FormField
          id="profile-gender"
          label="Пол"
          error={errors?.gender}
          className={clsx(styles.fieldWrapper, errors?.gender && styles.hasError)}
        >
          <Select
            id="profile-gender"
            label=""
            options={GENDER_OPTIONS}
            value={gender}
            onChange={(val) => setGender(val as Gender)}
          />
        </FormField>
      </div>

      <FormField
        id="profile-town"
        label="Город"
        error={errors?.town}
        className={clsx(styles.fieldWrapper, errors?.town && styles.hasError)}
      >
        <Select id="profile-town" label="" options={cityOptions} value={town} onChange={setTown} />
      </FormField>

      <FormField
        id="profile-description"
        label="О себе"
        error={errors?.description}
        className={clsx(styles.fieldWrapper, errors?.description && styles.hasError)}
      >
        <Textarea
          label=""
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          iconRight="edit"
          readOnly={!isEditable.description}
          onIconRightClick={() =>
            setIsEditable((prev) => ({ ...prev, description: !prev.description }))
          }
          rows={4}
        />
      </FormField>

      <Button type="submit" variant="primary" className={styles.submitButton}>
        Сохранить
      </Button>
    </form>
  )
}
