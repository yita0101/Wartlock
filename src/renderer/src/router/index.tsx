import Providers from '@renderer/providers'
import { RouterProvider } from 'react-router'
import { router } from './router'

export const Router = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
