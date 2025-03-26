import { Button, cn } from '@heroui/react'
import { useTheme } from '@renderer/providers/ThemeProvider'
import { motion } from 'framer-motion'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { BsMoon } from 'react-icons/bs'
import { FiSun } from 'react-icons/fi'

export const SwitchTheme: FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <div>
      <Button
        onPress={toggleTheme}
        variant="light"
        className={cn(
          'w-full min-w-6 items-center justify-start gap-8 text-default-400 hover:text-default-600 dark:flex',
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
          {theme === 'dark' ? t('theme.darkMode') : t('theme.lightMode')}
        </motion.span>
      </Button>
    </div>
  )
}
