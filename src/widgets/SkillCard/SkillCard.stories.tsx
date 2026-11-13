import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { Skill } from '@/shared/types'
import { SkillCard } from './SkillCard'
import type { SkillCardProps } from './interface'

const drums: Skill = {
  id: 'skill-10',
  title: 'Игра на барабанах',
  description:
    'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. ' +
    'Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, ' +
    'импровизировать и звучать уверенно даже без партитуры.',
  type: 'teach',
  category: 'creativity',
  subcategory: 'creativity-music-and-sound',
  tags: ['барабаны', 'ритм'],
  images: [
    '/img/skills/skill-10.png',
    '/img/skills/skill-11.png',
    '/img/skills/skill-12.png',
    '/img/skills/skill-14.png',
    '/img/skills/skill-15.png',
    '/img/skills/skill-16.png',
  ],
  authorId: 'user-05',
  createdAt: '2025-07-03T13:00:00Z',
}

const meta = {
  title: 'Widgets/SkillCard',
  component: SkillCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    skill: drums,
    author: { id: 'user-05', name: 'Дмитрий Попов' },
    categoryName: 'Творчество и искусство',
    subcategoryName: 'Музыка и звук',
    isLiked: false,
    isExchanged: false,
    onAction: fn(),
  },
  argTypes: {
    onAction: { control: false },
    className: { control: false },
  },
  render: function Render(args: SkillCardProps) {
    const [{ isLiked }, updateArgs] = useArgs<SkillCardProps>()

    const handleAction: SkillCardProps['onAction'] = (action) => {
      if (action === 'like') updateArgs({ isLiked: !isLiked })
      if (action === 'exchange') updateArgs({ isExchanged: true })
      args.onAction(action)
    }

    return (
      <div style={{ width: '100%', maxWidth: 1020, marginInline: 'auto' }}>
        <SkillCard {...args} isLiked={isLiked} onAction={handleAction} />
      </div>
    )
  },
} satisfies Meta<typeof SkillCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Навык',
}

export const Liked: Story = {
  name: 'Добавлен в избранное',
  args: { isLiked: true },
}

export const ExchangeProposed: Story = {
  name: 'Обмен предложен',
  args: { isExchanged: true },
}

export const NoImages: Story = {
  name: 'Без изображений',
  args: { skill: { ...drums, images: [] } },
}

export const LongContent: Story = {
  name: 'Длинное название и описание',
  args: {
    skill: {
      ...drums,
      title: 'Игра на барабанах: от первых ритмов до уверенной импровизации в музыкальной группе',
      description:
        'На занятиях разберём посадку за установкой, постановку рук и работу с метрономом. ' +
        'Начнём с простых упражнений на координацию и постепенно перейдём к любимым песням. ' +
        'Подберём темп под ваш опыт: можно прийти без музыкального образования и собственного инструмента. ' +
        'Покажу, как строить ритмические рисунки, слышать других музыкантов и придумывать свои партии. ' +
        'После каждого занятия дам упражнения для самостоятельной практики и помогу разобраться с трудными местами.',
    },
  },
}

export const Interactions: Story = {
  name: 'Лайк и предложение обмена',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /поставить лайк/i }))
    const unlikeButton = await canvas.findByRole('button', { name: /убрать лайк/i })
    await expect(args.onAction).toHaveBeenLastCalledWith('like')
    await expect(unlikeButton).toBeVisible()

    await userEvent.click(unlikeButton)
    const likeButton = await canvas.findByRole('button', { name: /поставить лайк/i })
    await expect(likeButton).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Предложить обмен' }))
    const pendingButton = await canvas.findByRole('button', { name: 'Обмен предложен' })
    await expect(args.onAction).toHaveBeenLastCalledWith('exchange')
    await expect(pendingButton).toBeDisabled()
  },
}
