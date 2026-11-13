import { useId } from 'react'
import clsx from 'clsx'
import type { Gender } from '@/shared/types'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { DatePicker } from '@/shared/ui/DatePicker'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { MultiSelect } from '@/shared/ui/MultiSelect'
import { Select } from '@/shared/ui/Select'
import type { RegisterStep2FormProps, RegisterStep2Values } from './interface'
import styles from './RegisterStep2Form.module.css'

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'unspecified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

export function RegisterStep2Form({
  values,
  onChange,
  errors,
  cityOptions,
  categoryOptions,
  subcategoryOptions,
  onAvatarAdd,
  onBack,
  onSubmit,
}: RegisterStep2FormProps) {
  const id = useId()
  const update = (next: Partial<RegisterStep2Values>) => onChange({ ...values, ...next })

  return (
    <form
      className={styles.form}
      aria-label="Второй шаг регистрации"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className={styles.fields}>
        <FormField className={styles.avatar} error={errors?.avatarUrl}>
          <Avatar
            size="medium"
            src={values.avatarUrl}
            alt="Аватар пользователя"
            onAdd={onAvatarAdd}
          />
        </FormField>
        <Input
          label="Имя"
          placeholder="Введите ваше имя"
          value={values.name}
          onChange={(event) => update({ name: event.target.value })}
          error={errors?.name}
        />
        <div className={styles.row}>
          <DatePicker
            label="Дата рождения"
            placeholder="дд.мм.гггг"
            value={values.birthday}
            onChange={(birthday) => update({ birthday })}
            error={errors?.birthday}
          />
          <FormField
            id={`${id}-gender`}
            className={clsx(styles.selectField, {
              [styles.unspecified]: values.gender === 'unspecified',
              [styles.invalid]: errors?.gender,
            })}
            error={errors?.gender}
          >
            <Select
              id={`${id}-gender`}
              label="Пол"
              placeholder="Не указан"
              options={genderOptions}
              value={values.gender}
              onChange={(gender) => update({ gender: gender as Gender })}
            />
          </FormField>
        </div>
        <FormField
          id={`${id}-city`}
          className={clsx(styles.selectField, { [styles.invalid]: errors?.cityId })}
          error={errors?.cityId}
        >
          <Select
            id={`${id}-city`}
            label="Город"
            placeholder="Не указан"
            options={cityOptions}
            value={values.cityId}
            onChange={(cityId) => update({ cityId })}
          />
        </FormField>
        <FormField
          id={`${id}-categories`}
          className={clsx(styles.selectField, { [styles.invalid]: errors?.categoryIds })}
          error={errors?.categoryIds}
        >
          <MultiSelect
            id={`${id}-categories`}
            label="Категория навыка, которому хотите научиться"
            placeholder="Выберите категорию"
            options={categoryOptions}
            value={values.categoryIds}
            onChange={(categoryIds) => update({ categoryIds })}
          />
        </FormField>
        <FormField
          id={`${id}-subcategories`}
          className={clsx(styles.selectField, { [styles.invalid]: errors?.subcategoryIds })}
          error={errors?.subcategoryIds}
        >
          <MultiSelect
            id={`${id}-subcategories`}
            label="Подкатегория навыка, которому хотите научиться"
            placeholder="Выберите подкатегорию"
            options={subcategoryOptions}
            value={values.subcategoryIds}
            onChange={(subcategoryIds) => update({ subcategoryIds })}
            disabled={values.categoryIds.length === 0}
          />
        </FormField>
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit">Продолжить</Button>
      </div>
    </form>
  )
}
