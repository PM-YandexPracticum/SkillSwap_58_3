import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { Info } from '@/shared/ui/Info'
import { ROUTES } from '@/shared/lib/constants'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <section className={styles.page} aria-label="Страница не найдена">
      <Info
        variant="error"
        image="error-404"
        alt="Монитор с ошибкой 404"
        title="Страница не найдена"
        description="К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже"
      />
      <div className={styles.actions}>
        <Button variant="outline" className={styles.button}>
          Сообщить об ошибке
        </Button>
        <Button className={styles.button} onClick={() => navigate(ROUTES.HOME)}>
          На главную
        </Button>
      </div>
    </section>
  )
}
