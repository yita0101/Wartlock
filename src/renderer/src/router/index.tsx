import Providers from '@renderer/providers'
import { FC } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './router'

export const Router: FC = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
