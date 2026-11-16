import type { RefObject } from 'react'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { usePaginatedList } from '@/shared/hooks/usePaginatedList'
import { Loader } from '@/shared/ui/Loader'
import { SkillsSection } from '@/widgets/SkillsSection'
import type { SkillsSectionProps } from '@/widgets/SkillsSection/interface'
import styles from './CatalogPage.module.css'

interface PaginatedSkillsSectionProps extends SkillsSectionProps {
  /** Сколько карточек показывать за раз. */
  pageSize: number
  /** Задержка перед показом следующей порции, мс. */
  delay: number
}

// Секция, которая подгружает карточки порциями, когда пользователь долистал до конца списка.
// items должен быть стабильной ссылкой (useMemo), иначе показ сбрасывается на каждом рендере.
export function PaginatedSkillsSection({
  items,
  pageSize,
  delay,
  ...sectionProps
}: PaginatedSkillsSectionProps) {
  const { visibleItems, hasMore, isLoading, loadMore } = usePaginatedList(items, {
    pageSize,
    delay,
  })
  const markerRef = useInfiniteScroll({ hasMore, isLoading, onLoadMore: loadMore })

  return (
    <div className={styles.paginated}>
      <SkillsSection {...sectionProps} items={visibleItems} />
      {/* хук отдаёт RefObject<HTMLDivElement | null> (типы React 19), а у нас React 18 */}
      <div ref={markerRef as RefObject<HTMLDivElement>} />
      {isLoading && (
        <div className={styles.loadMore}>
          <Loader />
        </div>
      )}
    </div>
  )
}
