import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'
import { FavoritesInitializer } from '@/features/favorites/model/FavoritesInitializer'
import './styles/global.css'

export function App() {
  return (
    <StoreProvider>
      <FavoritesInitializer />
      <AppRouter />
    </StoreProvider>
  )
}
