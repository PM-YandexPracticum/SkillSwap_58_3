import { useId, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { FormField } from '@/shared/ui/FormField'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import type { RegisterStep3FormProps } from './interface'
import styles from './RegisterStep3Form.module.css'

export function RegisterStep3Form({
  values,
  onChange,
  errors = {},
  categoryOptions,
  subcategoryOptions,
  onBack,
  onSubmit,
}: RegisterStep3FormProps) {
  const id = useId()
  const categoryId = `${id}-category`
  const subcategoryId = `${id}-subcategory`

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...values, title: event.target.value })

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    onChange({ ...values, description: event.target.value })

  // если подкатегория уже выбрана из другой категории, сбрасываем её
  const handleCategoryChange = (nextCategoryId: string) => {
    const current = subcategoryOptions.find((option) => option.value === values.subcategoryId)
    const keepSubcategory = current?.categoryId === nextCategoryId
    onChange({
      ...values,
      categoryId: nextCategoryId,
      subcategoryId: keepSubcategory ? values.subcategoryId : '',
    })
  }

  // выбор подкатегории сам проставляет её категорию
  const handleSubcategoryChange = (nextSubcategoryId: string) => {
    const option = subcategoryOptions.find((item) => item.value === nextSubcategoryId)
    onChange({
      ...values,
      subcategoryId: nextSubcategoryId,
      categoryId: option?.categoryId ?? values.categoryId,
    })
  }

  const handleImagesChange = (images: File[]) => onChange({ ...values, images })

  const handleImageRemove = (index: number) =>
    onChange({ ...values, images: values.images.filter((_, i) => i !== index) })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fields}>
        <Input
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          value={values.title}
          onChange={handleTitleChange}
          error={errors.title}
        />
        <FormField id={categoryId} label="Категория навыка" error={errors.categoryId}>
          <Select
            id={categoryId}
            options={categoryOptions}
            value={values.categoryId}
            onChange={handleCategoryChange}
            placeholder="Выберите категорию навыка"
          />
        </FormField>
        <FormField id={subcategoryId} label="Подкатегория навыка" error={errors.subcategoryId}>
          <Select
            id={subcategoryId}
            options={subcategoryOptions}
            value={values.subcategoryId}
            onChange={handleSubcategoryChange}
            placeholder="Выберите подкатегорию навыка"
          />
        </FormField>
        <Textarea
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          value={values.description}
          onChange={handleDescriptionChange}
          error={errors.description}
        />
        <ImageUpload
          files={values.images}
          onChange={handleImagesChange}
          onRemove={handleImageRemove}
          error={errors.images}
        />
      </div>
      <div className={styles.actions}>
        <Button variant="outline" className={styles.button} onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" className={styles.button}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}
