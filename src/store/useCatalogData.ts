import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import {
  loadCatalogData,
  selectCatalogError,
  selectCatalogStatus,
  selectCategories,
  selectCities,
  selectSkills,
  selectUsers,
} from './slices/catalogSlice'

// хук для доступа к данным каталога

export const useCatalogData = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const skills = useAppSelector(selectSkills)
  const categories = useAppSelector(selectCategories)
  const cities = useAppSelector(selectCities)
  const status = useAppSelector(selectCatalogStatus)
  const error = useAppSelector(selectCatalogError)

  useEffect(() => {
    dispatch(loadCatalogData())
  }, [dispatch])

  return {
    users,
    skills,
    categories,
    cities,
    isLoading: status === 'loading',
    hasError: status === 'failed',
    error,
  }
}
