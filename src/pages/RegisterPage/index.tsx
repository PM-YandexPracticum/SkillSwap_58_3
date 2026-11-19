import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import clsx from 'clsx'
import { fetchCities } from '@/api/cities'
import { fetchCategories } from '@/api/categories'
import { registerUser } from '@/features/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import type { Category, City } from '@/shared/types'
import { useAppDispatch } from '@/store/hooks'
import { AuthLayout } from '@/widgets/AuthLayout'
import { AuthForm } from '@/widgets/AuthForm'
import type { AuthFormValues } from '@/widgets/AuthForm/interface'
import { RegisterStep2Form, type RegisterStep2Values } from '@/widgets/RegisterStep2Form'
import { RegisterStep3Form, type RegisterStep3Values } from '@/widgets/RegisterStep3Form'
import { SkillPreviewModal, type SkillPreviewModalSkill } from '@/widgets/SkillPreviewModal'
import styles from './RegisterPage.module.css'

const STEP_INFO = {
  1: {
    image: 'light-bulb',
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
    alt: 'Лампочка как символ обмена знаниями',
  },
  2: {
    image: 'user-info',
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
    alt: 'Пользователь рассказывает о себе',
  },
  3: {
    image: 'school-board',
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
    alt: 'Доска для объяснения навыка',
  },
} as const

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const avatarInput = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [credentials, setCredentials] = useState<AuthFormValues>({ email: '', password: '' })
  const [profile, setProfile] = useState<RegisterStep2Values>({
    name: '',
    birthday: null,
    gender: 'unspecified',
    cityId: '',
    categoryIds: [],
    subcategoryIds: [],
  })
  const [skill, setSkill] = useState<RegisterStep3Values>({
    title: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    images: [],
  })
  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [previewImages, setPreviewImages] = useState<SkillPreviewModalSkill['images']>([])
  const [isPreviewOpen, setPreviewOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([fetchCities(), fetchCategories()])
      .then(([nextCities, nextCategories]) => {
        if (!active) return
        setCities(nextCities)
        setCategories(nextCategories)
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить списки. Обновите страницу и попробуйте ещё раз.')
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const images = skill.images.map((file, index) => ({
      id: String(index),
      src: URL.createObjectURL(file),
      alt: file.name,
    }))
    setPreviewImages(images)
    return () => images.forEach((image) => URL.revokeObjectURL(image.src))
  }, [skill.images])

  const cityOptions = cities.map((city) => ({ value: city.id, label: city.name }))
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))
  const subcategoryOptions = categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
      categoryId: category.id,
    })),
  )

  async function confirmRegistration() {
    setError('')
    const result = await dispatch(
      registerUser({
        ...credentials,
        name: profile.name,
        birthday: profile.birthday ? format(profile.birthday, 'yyyy-MM-dd') : '',
        gender: profile.gender,
        town: profile.cityId,
        learn: profile.subcategoryIds,
        avatarUrl: profile.avatarUrl,
      }),
    )
    if (registerUser.fulfilled.match(result)) navigate(ROUTES.HOME)
    if (registerUser.rejected.match(result) && !result.meta.condition) {
      setError(result.payload ?? 'Не удалось зарегистрироваться. Попробуйте ещё раз.')
      setPreviewOpen(false)
    }
  }

  return (
    <>
      <AuthLayout
        {...STEP_INFO[step]}
        variant="registration"
        currentStep={step}
        onClose={() => navigate(ROUTES.HOME)}
      >
        <div
          className={clsx(styles.form, {
            [styles.credentials]: step === 1,
            [styles.skill]: step === 3,
          })}
        >
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {step === 1 && (
            <AuthForm
              variant="registration"
              savedValues={credentials}
              onSubmit={(values) => {
                setCredentials({ email: values.email ?? '', password: values.password ?? '' })
                setStep(2)
              }}
            />
          )}
          {step === 2 && (
            <RegisterStep2Form
              values={profile}
              onChange={setProfile}
              cityOptions={cityOptions}
              categoryOptions={categoryOptions}
              subcategoryOptions={subcategoryOptions}
              onAvatarAdd={() => avatarInput.current?.click()}
              onBack={() => setStep(1)}
              onSubmit={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <RegisterStep3Form
              values={skill}
              onChange={setSkill}
              categoryOptions={categoryOptions}
              subcategoryOptions={subcategoryOptions}
              onBack={() => setStep(2)}
              onSubmit={() => setPreviewOpen(true)}
            />
          )}
        </div>
      </AuthLayout>
      <input
        ref={avatarInput}
        type="file"
        accept="image/*"
        aria-label="Загрузить аватар"
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => {
            const avatarUrl = reader.result
            if (typeof avatarUrl === 'string') setProfile((value) => ({ ...value, avatarUrl }))
          }
          reader.onerror = () => setError('Не удалось загрузить фото. Попробуйте ещё раз.')
          reader.readAsDataURL(file)
        }}
      />
      <SkillPreviewModal
        isOpen={isPreviewOpen}
        skill={{
          title: skill.title,
          categoryName:
            categoryOptions.find((option) => option.value === skill.categoryId)?.label ?? '',
          subcategoryName:
            subcategoryOptions.find((option) => option.value === skill.subcategoryId)?.label ?? '',
          description: skill.description,
          images: previewImages,
        }}
        onEdit={() => setPreviewOpen(false)}
        onConfirm={confirmRegistration}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  )
}
