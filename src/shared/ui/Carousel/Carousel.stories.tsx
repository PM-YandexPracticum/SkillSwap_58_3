import { Carousel } from './Carousel'

export default {
  title: 'Components/Carousel',
  component: Carousel,
}

// локах заклушки без вснешних фоток
const placeholder = (number: number, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="440"><rect width="440" height="440" fill="${color}"/><text x="220" y="250" font-family="sans-serif" font-size="96" fill="#fff" text-anchor="middle">${number}</text></svg>`,
  )}`

const palette = ['#abd27a', '#69735d', '#508826', '#253017', '#deebc5', '#b2b9a9']

const oneImage = [
  { id: 'image-0', src: placeholder(1, palette[0] ?? '#abd27a'), alt: 'Фотография 1' },
]

const sixImages = Array.from({ length: 6 }, (_, index) => ({
  id: `image-${index}`,
  src: placeholder(index + 1, palette[index % palette.length] ?? '#abd27a'),
  alt: `Фотография ${index + 1}`,
}))

// одно фото (без стрелок)
export const SinglePhoto = {
  args: { images: oneImage },
}

// полный вид галереи (как по макету: 3 миниатюры, стрелки, n+)
export const FullGallery = {
  args: { images: sixImages },
}

// без фото (серый фон как заглушка)
export const Empty = {
  args: { images: [] },
}
