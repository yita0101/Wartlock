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
      <label className="block mb-2 text-md font-medium text-default-700 dark:text-default-300">
        {t('settings.language')}
      </label>
      <Select
        aria-label={t('settings.language')}
        labelPlacement="outside-left"
        placeholder={t('settings.selectLanguage')}
        selectedKeys={[i18n.language.substring(0, 2)]}
        onChange={(e) => handleSelectionChange(e.target.value)}
        startContent={<BsGlobe className="text-primary-500" size={20} />}
        size="lg"
        variant="bordered"
        className="max-w-full"
        classNames={{
          trigger: 'bg-default-100 dark:bg-default-200/30 border-default-300 dark:border-default-500',
          listbox: 'bg-default-50 dark:bg-default-800 border-default-300 dark:border-default-600',
          value: 'text-default-800 dark:text-default-200 font-medium',
          base: 'text-default-800 dark:text-default-200',
          innerWrapper: 'font-medium',
          popoverContent: 'bg-default-50 dark:bg-default-800'
        }}
      >
        {languages.map((lang) => (
          <SelectItem 
            key={lang.key} 
            textValue={lang.name}
            className="text-default-800 dark:text-default-200 font-medium data-[hover=true]:bg-default-200 dark:data-[hover=true]:bg-default-700"
          >
            <span className="text-default-800 dark:text-default-200 font-medium">{lang.name}</span>
          </SelectItem>
        ))}
      </Select>
    </div>
  )
} 