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
    // 检查是否有保存的主题设置
    const savedTheme = localStorage.getItem('theme') as Theme
    
    // 如果没有保存的主题，始终使用暗色主题
    if (!savedTheme) {
      setTheme('dark')
      localStorage.setItem('theme', 'dark')
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
