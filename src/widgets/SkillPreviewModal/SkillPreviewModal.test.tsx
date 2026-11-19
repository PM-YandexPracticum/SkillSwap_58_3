import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SkillPreviewModal } from './SkillPreviewModal'
import type { SkillPreviewModalProps } from './interface'

afterEach(cleanup)

const createProps = (): SkillPreviewModalProps => ({
  isOpen: true,
  skill: {
    title: 'Рисование акварелью',
    categoryName: 'Творчество и искусство',
    subcategoryName: 'Рисование и иллюстрации',
    description: 'Научу основам рисунка',
    images: [
      { id: 'a', src: '/a.png', alt: 'Первая работа' },
      { id: 'b', src: '/b.png', alt: 'Вторая работа' },
    ],
  },
  onEdit: vi.fn(),
  onConfirm: vi.fn(),
  onClose: vi.fn(),
})

describe('SkillPreviewModal', () => {
  it('renders a dialog named by its heading', () => {
    render(<SkillPreviewModal {...createProps()} />)

    const dialog = screen.getByRole('dialog')

    expect(dialog).toHaveAccessibleName('Ваше предложение')
    expect(screen.getByRole('heading', { name: 'Ваше предложение' })).toBeInTheDocument()
  })

  it('shows the skill data', () => {
    render(<SkillPreviewModal {...createProps()} />)

    expect(screen.getByRole('heading', { name: 'Рисование акварелью' })).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Рисование и иллюстрации')).toBeInTheDocument()
    expect(screen.getByText('Научу основам рисунка')).toBeInTheDocument()
    expect(screen.getAllByAltText('Первая работа').length).toBeGreaterThan(0)
  })

  it('calls onEdit when the edit button is clicked', async () => {
    const props = createProps()
    render(<SkillPreviewModal {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }))

    expect(props.onEdit).toHaveBeenCalledTimes(1)
    expect(props.onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const props = createProps()
    render(<SkillPreviewModal {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Готово' }))

    expect(props.onConfirm).toHaveBeenCalledTimes(1)
    expect(props.onEdit).not.toHaveBeenCalled()
  })

  it('calls onClose on Escape', async () => {
    const props = createProps()
    render(<SkillPreviewModal {...props} />)

    await userEvent.keyboard('{Escape}')

    expect(props.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay is clicked', async () => {
    const props = createProps()
    render(<SkillPreviewModal {...props} />)

    const overlay = screen.getByRole('dialog').parentElement as HTMLElement
    await userEvent.click(overlay)

    expect(props.onClose).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when isOpen is false', () => {
    render(<SkillPreviewModal {...createProps()} isOpen={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Рисование акварелью')).not.toBeInTheDocument()
  })

  it('shows the error text when error is passed', () => {
    render(<SkillPreviewModal {...createProps()} error="Не удалось зарегистрироваться" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось зарегистрироваться')
  })

  it('shows no alert without error', () => {
    render(<SkillPreviewModal {...createProps()} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
