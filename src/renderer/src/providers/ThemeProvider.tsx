import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'dark',
  )

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.remove(theme)
    document.documentElement.classList.add(newTheme)
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    // 检查系统主题偏好
    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    const savedTheme = localStorage.getItem('theme') as Theme
    
    // 如果没有保存的主题，使用系统偏好
    if (!savedTheme) {
      const initialTheme = prefersDarkTheme ? 'dark' : 'light'
      setTheme(initialTheme)
      localStorage.setItem('theme', initialTheme)
    }
    
    // 应用正确的主题类到文档根元素
    document.documentElement.classList.add(theme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
