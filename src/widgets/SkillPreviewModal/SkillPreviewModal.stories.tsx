import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/app/styles/global.css'
import { Button } from '@/shared/ui/Button'
import type { CarouselImage } from '@/shared/ui/Carousel'
import { SkillPreviewModal } from './SkillPreviewModal'
import type { SkillPreviewModalProps, SkillPreviewModalSkill } from './interface'

const palette = ['#abd27a', '#69735d', '#508826', '#b2b9a9', '#deebc5', '#e0796e']

const placeholder = (number: number, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="440"><rect width="440" height="440" fill="${color}"/><text x="220" y="250" font-family="sans-serif" font-size="96" fill="#fff" text-anchor="middle">${number}</text></svg>`,
  )}`

const makeImages = (count: number): CarouselImage[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `image-${index}`,
    src: placeholder(index + 1, palette[index % palette.length] ?? '#abd27a'),
    alt: `Фотография ${index + 1}`,
  }))

const baseSkill: SkillPreviewModalSkill = {
  title: 'Рисование акварелью',
  categoryName: 'Творчество и искусство',
  subcategoryName: 'Рисование и иллюстрации',
  description:
    'Привет! Я рисую и занимаюсь творчеством уже больше 10 лет — от первых набросков в скетчбуках до профессиональных выставок и работы на заказ. Научу основам рисунка (и как не бояться чистого листа), владеть любимыми материалами, видеть пропорции.',
  images: makeImages(6),
}

function SkillPreviewModalPreview({ isOpen, onClose, ...args }: SkillPreviewModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)
  const close = () => {
    setIsVisible(false)
    onClose()
  }

  return (
    <>
      <Button onClick={() => setIsVisible(true)}>Открыть окно</Button>
      <SkillPreviewModal {...args} isOpen={isOpen && isVisible} onClose={close} />
    </>
  )
}

const meta = {
  title: 'Widgets/SkillPreviewModal',
  component: SkillPreviewModal,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    skill: baseSkill,
    onEdit: () => {},
    onConfirm: () => {},
    onClose: () => {},
  },
  argTypes: {
    onEdit: { control: false },
    onConfirm: { control: false },
    onClose: { control: false },
  },
  render: (args) => <SkillPreviewModalPreview {...args} />,
} satisfies Meta<typeof SkillPreviewModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Открытая модалка',
}

export const SeveralPhotos: Story = {
  name: 'С несколькими фото',
  args: { skill: { ...baseSkill, images: makeImages(6) } },
}

export const SinglePhoto: Story = {
  name: 'С одним фото',
  args: { skill: { ...baseSkill, images: makeImages(1) } },
}

export const LongDescription: Story = {
  name: 'С длинным описанием',
  args: {
    skill: {
      ...baseSkill,
      description: Array.from({ length: 6 }, () => baseSkill.description).join(' '),
    },
  },
}
