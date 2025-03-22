import { Button, cn } from '@heroui/react'
import { useTheme } from '@renderer/providers/ThemeProvider'
import { motion } from 'framer-motion'
import { BsMoon } from 'react-icons/bs'
import { FiSun } from 'react-icons/fi'

export const SwitchTheme = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <Button
        onPress={toggleTheme}
        variant="light"
        className={cn(
          'hidden w-full min-w-6 items-center justify-start gap-8 text-default-400 hover:text-default-600 dark:flex',
          theme === 'dark' ? 'flex' : 'hidden',
        )}
      >
        {theme === 'dark' ? (
          <BsMoon size={20} className="text-white" />
        ) : (
          <FiSun size={20} className="text-default-600" />
        )}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden whitespace-pre font-medium group-hover/sidebar:inline"
        >
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </motion.span>
      </Button>
    </div>
  )
}
