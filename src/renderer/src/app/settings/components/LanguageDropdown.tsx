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
      <label className="block mb-2 text-md font-bold text-black dark:text-white">
        {t('settings.language')}
      </label>
      <Select
        aria-label={t('settings.language')}
        labelPlacement="outside-left"
        placeholder={t('settings.selectLanguage')}
        selectedKeys={[i18n.language.substring(0, 2)]}
        onChange={(e) => handleSelectionChange(e.target.value)}
        startContent={<BsGlobe className="text-primary" size={20} />}
        size="lg"
        variant="bordered"
        className="max-w-full"
        classNames={{
          trigger: 'bg-surface-hover border-2 border-border',
          listbox: 'bg-surface border-2 border-border',
          value: 'text-black dark:text-white font-medium',
          base: 'text-black dark:text-white',
          innerWrapper: 'font-medium'
        }}
      >
        {languages.map((lang) => (
          <SelectItem 
            key={lang.key} 
            textValue={lang.name}
            className="text-black dark:text-white font-medium"
          >
            <span className="text-black dark:text-white font-medium">{lang.name}</span>
          </SelectItem>
        ))}
      </Select>
    </div>
  )
} 