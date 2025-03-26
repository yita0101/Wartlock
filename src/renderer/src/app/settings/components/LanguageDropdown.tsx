import { Select, SelectItem } from '@heroui/react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { BsGlobe } from 'react-icons/bs'

type Language = {
  key: string
  name: string
}

const languages: Language[] = [
  { key: 'en', name: 'English' },
  { key: 'zh', name: '中文' },
]

export const LanguageDropdown: FC = () => {
  const { i18n, t } = useTranslation()

  const handleSelectionChange = (value: string): void => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
  }

  return (
    <div className="w-full">
      <label className="text-md mb-2 block font-medium text-default-300 dark:text-default-700">
        {t('settings.language')}
      </label>
      <Select
        aria-label={t('settings.language')}
        placeholder={t('settings.selectLanguage')}
        selectedKeys={[i18n.language.substring(0, 2)]}
        onChange={(e) => handleSelectionChange(e.target.value)}
        startContent={<BsGlobe className="text-primary-500" size={20} />}
        size="lg"
        className="w-full"
        classNames={
          {
            // trigger:
            //   'bg-default-100 dark:bg-default-200 border-default-300 dark:border-default-500',
            // listbox:
            //   'bg-default-50 dark:bg-default-800 border-default-300 dark:border-default-600',
            // value: 'text-default-800 dark:text-default-200 font-medium',
            // base: 'text-default-800 dark:text-default-200',
            // innerWrapper: 'font-medium',
            // popoverContent: 'bg-default-50 dark:bg-default-800',
          }
        }
      >
        {languages.map((lang) => (
          <SelectItem
            key={lang.key}
            textValue={lang.name}
            className="font-medium text-default-800 dark:text-default-800"
          >
            <span className="font-medium">{lang.name}</span>
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}
