import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import { Info } from '@/shared/ui/Info'
import styles from './ServerErrorPage.module.css'

export default function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Info
          image="error-500"
          variant="error"
          title="На сервере произошла ошибка"
          description="Попробуйте позже или вернитесь на главную страницу"
          alt="Монитор с ошибкой 500"
        />
        <div className={styles.actions}>
          <Button variant="outline" className={styles.button}>
            Сообщить об&nbsp;ошибке
          </Button>
          <Button variant="primary" className={styles.button} onClick={() => navigate(ROUTES.HOME)}>
            На&nbsp;главную
          </Button>
        </div>
      </div>
    </main>
  )
}
