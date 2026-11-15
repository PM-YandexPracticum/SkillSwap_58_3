import { AuthLayout } from '@/widgets/AuthLayout'

export default function LoginPage() {
  return (
    <AuthLayout
      image="light-bulb"
      alt="bell-img"
      variant="registration"
      title="Добро пожаловать в SkillSwap!"
      description="Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
    >
      authForm
      {/* todo <AuthForm variant='login'/> */}
    </AuthLayout>
  )
}
