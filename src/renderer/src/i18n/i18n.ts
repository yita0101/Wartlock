import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入翻译文件
import en from './locales/en.json'
import zh from './locales/zh.json'

// i18n初始化
i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18n
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      }
    },
    fallbackLng: 'en', // 如果用户语言不可用，则使用英语
    interpolation: {
      escapeValue: false // 不转义HTML
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // 将语言选择缓存在localStorage中
    }
  })

export default i18n
