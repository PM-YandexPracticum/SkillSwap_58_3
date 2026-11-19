import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { fetchCities } from '@/api/cities'
import { fetchCategories } from '@/api/categories'
import { completeRegistration } from '@/features/auth/model/completeRegistration'
import { isEmailTaken } from '@/features/auth/model/authUtils'
import { getPasswordError } from '@/shared/lib/passwordValidation'
import { ROUTES } from '@/shared/lib/constants'
import type { Category, City } from '@/shared/types'
import { useAppDispatch } from '@/store/hooks'
import { AuthLayout } from '@/widgets/AuthLayout'
import { AuthForm } from '@/widgets/AuthForm'
import type { AuthFormProps, AuthFormValues } from '@/widgets/AuthForm/interface'
import { RegisterStep2Form, type RegisterStep2FormProps } from '@/widgets/RegisterStep2Form'
import { RegisterStep3Form, type RegisterStep3Errors } from '@/widgets/RegisterStep3Form'
import { SkillPreviewModal, type SkillPreviewModalSkill } from '@/widgets/SkillPreviewModal'
import { REGISTER_ERRORS, STEP_INFO, type RegisterStep } from './constants'
import {
  buildRegisterPayload,
  INITIAL_CREDENTIALS,
  INITIAL_STEP2,
  INITIAL_STEP3,
  validateStep2,
  validateStep3,
} from './helpers'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [step, setStep] = useState<RegisterStep>(1)
  const [credentials, setCredentials] = useState<AuthFormValues>(INITIAL_CREDENTIALS)
  const [profile, setProfile] = useState(INITIAL_STEP2)
  const [skill, setSkill] = useState(INITIAL_STEP3)
  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [previewImages, setPreviewImages] = useState<SkillPreviewModalSkill['images']>([])
  const [isPreviewOpen, setPreviewOpen] = useState(false)
  const [error, setError] = useState('')
  const [step1Errors, setStep1Errors] = useState<AuthFormProps['errors']>()
  const [step2Errors, setStep2Errors] = useState<RegisterStep2FormProps['errors']>()
  const [step3Errors, setStep3Errors] = useState<RegisterStep3Errors>()
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([fetchCities(), fetchCategories()])
      .then(([nextCities, nextCategories]) => {
        if (!active) return
        setCities(nextCities)
        setCategories(nextCategories)
      })
      .catch(() => {
        if (active) setError(REGISTER_ERRORS.dictionariesFailed)
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

  async function handleStep1Submit({ email = '', password = '' }: Partial<AuthFormValues>) {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setStep1Errors({ email: REGISTER_ERRORS.emailRequired })
      return
    }
    try {
      if (await isEmailTaken(trimmedEmail)) {
        setStep1Errors({ email: REGISTER_ERRORS.emailTaken })
        return
      }
    } catch {
      setStep1Errors({ email: REGISTER_ERRORS.registerFailed })
      return
    }
    const passwordError = getPasswordError(password)
    if (passwordError) {
      setStep1Errors({ password: passwordError })
      return
    }
    setCredentials({ email: trimmedEmail, password })
    setStep1Errors(undefined)
    setStep(2)
  }

  function handleStep2Submit() {
    const { errors, isValid } = validateStep2(profile)
    setStep2Errors(errors)
    if (isValid) setStep(3)
  }

  function handleStep3Submit() {
    const { errors, isValid } = validateStep3(skill)
    setStep3Errors(errors)
    if (isValid) setPreviewOpen(true)
  }

  async function confirmRegistration() {
    setSubmitError('')
    try {
      await dispatch(
        completeRegistration({
          register: buildRegisterPayload(credentials, profile),
          step3: skill,
        }),
      ).unwrap()
      navigate(ROUTES.HOME)
    } catch (rejected) {
      const message = typeof rejected === 'string' ? rejected : REGISTER_ERRORS.registerFailed
      setSubmitError(message)
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
              errors={step1Errors}
              onSubmit={handleStep1Submit}
            />
          )}
          {step === 2 && (
            <RegisterStep2Form
              categories={categories}
              values={profile}
              onChange={setProfile}
              cityOptions={cityOptions}
              categoryOptions={categoryOptions}
              subcategoryOptions={subcategoryOptions}
              errors={step2Errors}
              onAvatarAdd={() => {}}
              onBack={() => setStep(1)}
              onSubmit={handleStep2Submit}
            />
          )}
          {step === 3 && (
            <RegisterStep3Form
              values={skill}
              onChange={setSkill}
              categoryOptions={categoryOptions}
              subcategoryOptions={subcategoryOptions}
              errors={step3Errors}
              onBack={() => setStep(2)}
              onSubmit={handleStep3Submit}
            />
          )}
        </div>
      </AuthLayout>
      <SkillPreviewModal
        isOpen={isPreviewOpen}
        error={submitError}
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
