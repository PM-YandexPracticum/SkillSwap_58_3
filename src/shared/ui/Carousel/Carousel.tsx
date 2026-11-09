import clsx from 'clsx'
import { useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { A11y, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Icon } from '../icons'
import type { CarouselProps } from './interface'
import styles from './Carousel.module.css'
import 'swiper/css'
import 'swiper/css/a11y'

// карусель фото на базе swiper (главная лента со стрелками)
// нужна для пользователя и в превью после регистрации.

export const Carousel = ({ images, maxThumbnails = 3, className }: CarouselProps) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // ограничиваем значение минимум одной миниатюрой и приводим дробное число к целому
  const thumbnailsLimit = Number.isFinite(maxThumbnails)
    ? Math.max(1, Math.floor(maxThumbnails))
    : 3
  const visibleThumbnails = images.slice(0, thumbnailsLimit)
  const hiddenImagesCount = Math.max(images.length - thumbnailsLimit, 0)

  const selectImage = (index: number) => {
    // swiper в loop-режиме создаёт служебные копии слайдов, поэтому нужен реальный индекс
    swiper?.slideToLoop(index)
  }

  if (images.length === 0) {
    return (
      <div className={clsx(styles.carousel, className)}>
        <div className={clsx(styles.main, styles.empty)} role="status">
          Изображения отсутствуют
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(styles.carousel, className)}>
      <div className={styles.main}>
        <Swiper
          className={styles.swiper}
          modules={[A11y, Keyboard]}
          slidesPerView={1}
          loop={images.length > 1}
          keyboard={{ enabled: true }}
          a11y={{
            prevSlideMessage: 'Предыдущее изображение',
            nextSlideMessage: 'Следующее изображение',
          }}
          onSwiper={setSwiper}
          onSlideChange={(currentSwiper) => {
            // activeIndex учитывает служебные копии, realIndex исходный массив images
            setActiveIndex(currentSwiper.realIndex)
          }}
        >
          {images.map((image) => (
            <SwiperSlide key={image.id} className={styles.slide}>
              <img className={styles.mainImage} src={image.src} alt={image.alt} />
            </SwiperSlide>
          ))}
        </Swiper>
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={clsx(styles.navigationButton, styles.previousButton)}
              onClick={() => swiper?.slidePrev()}
              aria-label="Предыдущее изображение"
            >
              <Icon name="chevron-left" />
            </button>
            <button
              type="button"
              className={clsx(styles.navigationButton, styles.nextButton)}
              onClick={() => swiper?.slideNext()}
              aria-label="Следующее изображение"
            >
              <Icon name="chevron-right" />
            </button>
          </>
        )}
      </div>
      <div className={styles.thumbnails} role="group" aria-label="Миниатюры изображений">
        {visibleThumbnails.map((image, index) => {
          // если изображения не помещаются, последняя миниатюра представляет скрытую группу
          const isOverflowThumbnail = hiddenImagesCount > 0 && index === thumbnailsLimit - 1
          // для скрытых слайдов активной остаётся общая миниатюра с индикатором n+
          const isActive = activeIndex === index || (isOverflowThumbnail && activeIndex >= index)
          return (
            <button
              key={image.id}
              type="button"
              className={clsx(styles.thumbnail, { [styles.activeThumbnail]: isActive })}
              onClick={() => selectImage(index)}
              aria-label={`Показать изображение ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <img src={image.src} alt="" />
              {isOverflowThumbnail && (
                <span className={styles.remainingCount}>+{hiddenImagesCount}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
