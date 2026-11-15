import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { DEFAULT_FILTERS, Filters } from './index'
import type { FiltersValues } from './interface'

vi.mock('@/api/categories', () => ({ fetchCategories: vi.fn() }))
vi.mock('@/api/cities', () => ({ fetchCities: vi.fn() }))

const activeValues: FiltersValues = {
  purpose: 'learn',
  gender: 'female',
  categoryIds: ['business'],
  subcategoryIds: ['business-resume'],
  cityIds: ['moscow'],
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(fetchCategories).mockResolvedValue([
    {
      id: 'business',
      name: 'Бизнес и карьера',
      subcategories: [{ id: 'business-resume', name: 'Резюме и собеседование' }],
    },
  ])
  vi.mocked(fetchCities).mockResolvedValue([
    { id: 'moscow', name: 'Москва' },
    { id: 'kazan', name: 'Казань' },
  ])
})

afterEach(cleanup)

describe('Filters', () => {
  it('показывает controlled значения и ждёт новых props после изменения', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<Filters values={activeValues} onChange={onChange} />)
    expect(await screen.findByRole('checkbox', { name: 'Москва' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Женский' })).toBeChecked()

    await user.click(screen.getByRole('radio', { name: 'Мужской' }))

    expect(onChange).toHaveBeenLastCalledWith({ ...activeValues, gender: 'male' })
    expect(screen.getByRole('radio', { name: 'Женский' })).toBeChecked()
    rerender(<Filters values={{ ...activeValues, gender: 'male' }} onChange={onChange} />)
    expect(screen.getByRole('radio', { name: 'Мужской' })).toBeChecked()

    await user.click(screen.getByRole('checkbox', { name: 'Казань' }))
    const nextValues = { ...activeValues, gender: 'male' as const, cityIds: ['moscow', 'kazan'] }
    expect(onChange).toHaveBeenLastCalledWith(nextValues)
    expect(screen.getByRole('checkbox', { name: 'Казань' })).not.toBeChecked()
    rerender(<Filters values={nextValues} onChange={onChange} />)
    expect(screen.getByRole('checkbox', { name: 'Казань' })).toBeChecked()
  })

  it('сбрасывает controlled фильтры через onChange и отображает сброс после rerender', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onReset = vi.fn()
    const { rerender } = render(
      <Filters values={activeValues} onChange={onChange} onReset={onReset} />,
    )
    await screen.findByRole('checkbox', { name: 'Москва' })

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(DEFAULT_FILTERS)
    expect(onReset).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Москва' })).toBeChecked()
    rerender(<Filters values={DEFAULT_FILTERS} onChange={onChange} />)
    expect(screen.getByRole('radio', { name: 'Всё' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Москва' })).not.toBeChecked()
    expect(screen.queryByRole('button', { name: 'Сбросить' })).not.toBeInTheDocument()
  })

  it('сохраняет uncontrolled выбор, поведение категорий и сброс', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Filters onChange={onChange} />)
    await screen.findByRole('checkbox', { name: 'Москва' })

    await user.click(screen.getByRole('radio', { name: 'Хочу научиться' }))
    await user.click(screen.getByRole('checkbox', { name: 'Бизнес и карьера' }))
    await user.click(
      screen.getByRole('button', { name: 'Показать подкатегории: Бизнес и карьера' }),
    )
    await user.click(screen.getByRole('checkbox', { name: 'Резюме и собеседование' }))
    await user.click(screen.getByRole('checkbox', { name: 'Москва' }))

    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Бизнес и карьера' })).toBePartiallyChecked()
    expect(onChange).toHaveBeenLastCalledWith({ ...activeValues, gender: 'any' })

    await user.click(screen.getByRole('checkbox', { name: 'Бизнес и карьера' }))
    expect(screen.getByRole('checkbox', { name: 'Резюме и собеседование' })).not.toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith({
      ...DEFAULT_FILTERS,
      purpose: 'learn',
      cityIds: ['moscow'],
    })

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))
    expect(screen.getByRole('radio', { name: 'Всё' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Москва' })).not.toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith(DEFAULT_FILTERS)
  })

  it('не изменяет замороженные props или defaults и отдаёт независимые массивы', async () => {
    const values: FiltersValues = {
      ...activeValues,
      categoryIds: [...activeValues.categoryIds],
      subcategoryIds: [...activeValues.subcategoryIds],
      cityIds: [...activeValues.cityIds],
    }
    Object.freeze(values.categoryIds)
    Object.freeze(values.subcategoryIds)
    Object.freeze(values.cityIds)
    Object.freeze(values)
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Filters values={values} onChange={onChange} />)
    await user.click(await screen.findByRole('checkbox', { name: 'Казань' }))

    const nextValues = onChange.mock.calls[0][0] as FiltersValues
    expect(values).toEqual(activeValues)
    expect(nextValues).toEqual({ ...activeValues, cityIds: ['moscow', 'kazan'] })
    expect(nextValues.categoryIds).not.toBe(values.categoryIds)
    expect(nextValues.subcategoryIds).not.toBe(values.subcategoryIds)
    expect(nextValues.cityIds).not.toBe(values.cityIds)
    expect(DEFAULT_FILTERS).toEqual({
      purpose: 'all',
      gender: 'any',
      categoryIds: [],
      subcategoryIds: [],
      cityIds: [],
    })
  })
})
