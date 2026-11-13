import { Meta, StoryObj } from '@storybook/react-vite'
import { TeamMemberCard } from './TeamMemberCard'

const meta: Meta<typeof TeamMemberCard> = {
  title: 'widgets/TeamMemberCard',
  component: TeamMemberCard,
  tags: ['autodocs'],
}

export default meta

export type Story = StoryObj<typeof TeamMemberCard>

export const Default: Story = {
  args: {
    avatarUrl: '/img/avatars/avatar-02.png',
    name: 'Бисултанова Танзила',
    role: 'Тимлид',
    description:
      'Магистрант по направленю «Информатика и вычислительная техника».        В данном проекте я координирую работу команды, распределяю задачи, провожу код-ревью и дорабатываю макет для общего удобства. Моя главная цель — создать для ребят такие условия, в которых каждый может выдать свой максимум без выгорания.',
    githubUrl: 'https://github.com/USERNAME',
  },
}
