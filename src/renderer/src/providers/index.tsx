import { HeroUIProvider, ToastProvider } from '@heroui/react'
import React, { FC } from 'react'
import { ThemeProvider } from './ThemeProvider'

const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <ThemeProvider>{children}</ThemeProvider>
    </HeroUIProvider>
  )
}

export default Providers
