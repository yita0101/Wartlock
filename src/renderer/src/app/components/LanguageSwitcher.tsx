import { Button, ButtonGroup, cn } from '@heroui/react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BsGlobe } from 'react-icons/bs'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')

  // 当语言改变时更新状态
  useEffect(() => {
    setCurrentLanguage(i18n.language.substring(0, 2))
  }, [i18n.language])

  // 切换语言
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
  }

  return (
    <div className="flex items-center gap-2">
      <BsGlobe className="text-text-secondary" size={16} />
      <ButtonGroup 
        variant="flat" 
        size="sm" 
        className="rounded-lg overflow-hidden"
      >
        <Button
          className={cn(
            'min-w-10',
            currentLanguage === 'en' 
              ? 'bg-accent text-white' 
              : 'bg-surface-hover text-text-primary'
          )}
          onPress={() => changeLanguage('en')}
        >
          EN
        </Button>
        <Button
          className={cn(
            'min-w-10',
            currentLanguage === 'zh' 
              ? 'bg-accent text-white' 
              : 'bg-surface-hover text-text-primary'
          )}
          onPress={() => changeLanguage('zh')}
        >
          中
        </Button>
      </ButtonGroup>
    </div>
  )
} 