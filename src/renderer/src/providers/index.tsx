import { HeroUIProvider, ToastProvider } from '@heroui/react'
import React from 'react'
import { ThemeProvider } from './ThemeProvider'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <ThemeProvider>{children}</ThemeProvider>
    </HeroUIProvider>
  )
}

export default Providers
