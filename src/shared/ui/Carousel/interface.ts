export interface CarouselImage {
  id: string
  src: string
  alt?: string
}

export interface CarouselProps {
  // массив ссылок на фото
  images: CarouselImage[]
  // макс в колонке, по дефолту 3
  maxThumbnails?: number
  // класс снаружи для дополнения стилей компонента
  className?: string
}
