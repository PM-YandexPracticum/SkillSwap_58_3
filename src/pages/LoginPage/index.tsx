import { AuthLayout } from '@/widgets/AuthLayout'
import { AuthForm } from '@/widgets/AuthForm'

export default function LoginPage() {
  return (
    <AuthLayout
      image="light-bulb"
      alt="bell-img"
      variant="registration"
      title="Добро пожаловать в SkillSwap!"
      description="Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
    >
      <AuthForm onSubmit={() => {}} savedValues={{ email: '', password: '' }} variant="login" />
    </AuthLayout>
  )
}
