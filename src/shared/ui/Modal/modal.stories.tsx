import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/app/styles/global.css'
import { Button } from '../Button'
import { Modal } from './modal'
import type { ModalProps } from './type'
import styles from './modal.module.css'

function ModalPreview({ isOpen, onClose, children, ...args }: ModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)
  const close = () => {
    setIsVisible(false)
    onClose()
  }

  return (
    <>
      <Button onClick={() => setIsVisible(true)}>Открыть окно</Button>
      <Modal {...args} isOpen={isOpen && isVisible} onClose={close}>
        <div className={styles.preview}>
          {children}
          <Button onClick={close}>Готово</Button>
        </div>
      </Modal>
    </>
  )
}

const meta = {
  title: 'Shared/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
  args: { isOpen: true, onClose: () => {}, children: null },
  argTypes: { onClose: { control: false }, children: { control: false } },
  render: (args) => <ModalPreview {...args} />,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Created: Story = {
  name: 'Предложение создано',
  args: {
    height: 420,
    ariaLabel: 'Ваше предложение создано',
    children: (
      <>
        <h2>Ваше предложение создано</h2>
        <p>Теперь вы можете предложить обмен</p>
      </>
    ),
  },
}

export const Offer: Story = {
  name: 'Ваше предложение',
  args: {
    width: 1024,
    height: 532,
    className: styles.offer,
    ariaLabel: 'Ваше предложение',
    children: (
      <>
        <h2>Ваше предложение</h2>
        <p>Пожалуйста, проверьте и подтвердите правильность данных</p>
        <p>Рисование акварелью — пример произвольного содержимого окна.</p>
      </>
    ),
  },
}

export const CustomSize: Story = {
  name: 'Пользовательские размеры',
  args: {
    width: '70vw',
    height: 320,
    ariaLabel: 'Пользовательские размеры',
    children: <p>Ширина — 70vw, высота — 320px.</p>,
  },
}

export const LongContent: Story = {
  name: 'Длинное содержимое',
  args: {
    ariaLabel: 'Длинное содержимое',
    children: Array.from({ length: 30 }, (_, index) => (
      <p key={index}>Пункт {index + 1}. Содержимое прокручивается внутри окна.</p>
    )),
  },
}
