import { Button, cn } from '@heroui/react'
import { useTheme } from '@renderer/providers/ThemeProvider'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BsMoon } from 'react-icons/bs'
import { FiSun } from 'react-icons/fi'

export const SwitchTheme = () => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <div>
      <Button
        onPress={toggleTheme}
        variant="light"
        className={cn(
          'w-full min-w-6 items-center justify-start gap-3 rounded-lg bg-surface p-2 text-text-primary transition-all duration-300 hover:bg-surface-hover',
        )}
      >
        {theme === 'dark' ? (
          <BsMoon size={20} className="text-primary" />
        ) : (
          <FiSun size={20} className="text-primary" />
        )}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="whitespace-pre font-medium group-hover/sidebar:inline"
        >
          {theme === 'dark' ? t('theme.darkMode') : t('theme.lightMode')}
        </motion.span>
      </Button>
    </div>
  )
}
