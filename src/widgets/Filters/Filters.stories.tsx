import { Filters } from './Filters'

export default {
  title: 'Widgets/Filters',
  component: Filters,
}

// дефолтное состояние

export const Default = {
  args: {},
}

// кликай по фильтрам и смотри результат в консоли и во вкладке Actions
// в колбэк прилетает полный объект значений (purpose, gender, categoryIds, subcategoryIds, cityIds)

export const WithOnChange = {
  args: {
    onChange: (values: unknown) => console.log('Filters onChange:', values),
  },
}
