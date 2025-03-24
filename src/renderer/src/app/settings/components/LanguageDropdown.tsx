import { Select, SelectItem } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { BsGlobe } from 'react-icons/bs'

type Language = {
  key: string
  name: string
}

const languages: Language[] = [
  { key: 'en', name: 'English' },
  { key: 'zh', name: '中文' }
]

export const LanguageDropdown = () => {
  const { i18n, t } = useTranslation()

  const handleSelectionChange = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
  }

  return (
    <div className="w-full">
      <Select
        label={t('settings.language')}
        labelPlacement="outside"
        placeholder={t('settings.selectLanguage')}
        selectedKeys={[i18n.language.substring(0, 2)]}
        onChange={(e) => handleSelectionChange(e.target.value)}
        startContent={<BsGlobe className="text-primary" />}
        size="lg"
        variant="bordered"
        className="max-w-full"
        classNames={{
          trigger: 'bg-surface-hover border-border',
          listbox: 'bg-surface border-border'
        }}
      >
        {languages.map((lang) => (
          <SelectItem 
            key={lang.key} 
            textValue={lang.name}
            className="text-text-primary"
          >
            {lang.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
} 