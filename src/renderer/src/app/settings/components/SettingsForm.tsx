import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Form,
  Input,
  Switch,
  Tab,
  Tabs,
} from '@heroui/react'
import { useTheme } from '@renderer/providers/ThemeProvider'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { LanguageDropdown } from './LanguageDropdown'

export const SettingsForm = () => {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchPeer = async () => {
      const fetchedPeer = await window.dbAPI.getPeer()
      if (isMounted) {
        setInputValue(fetchedPeer)
      }
    }

    fetchPeer()

    return () => {
      isMounted = false
    }
  }, [])

  const handleCancel = () => {
    navigate('/')
  }

  const handleSave = async () => {
    if (!inputValue.trim()) {
      addToast({
        title: t('toasts.error.title', { defaultValue: 'Error' }),
        description: 'Please enter a valid peer',
        color: 'danger',
      })
      return
    }

    try {
      await window.dbAPI.updatePeer(inputValue)
      addToast({
        title: t('settings.saved'),
        description: 'Your settings have been saved successfully',
        color: 'success',
        timeout: 2000,
      })
    } catch (error) {
      addToast({
        title: t('toasts.error.title', { defaultValue: 'Error' }),
        description: 'Failed to save settings',
        color: 'danger',
        timeout: 2000,
      })
    }
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white">{t('settings.title')}</h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">{t('settings.subtitle')}</p>
      </div>

      <Tabs 
        aria-label="Settings tabs" 
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative p-0 border-b-2 border-border",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-4 h-12 text-md font-bold",
          tabContent: "group-data-[selected=true]:text-primary text-black dark:text-white"
        }}
      >
        <Tab key="appearance" title={t('settings.appearance')} className="p-1">
          <Card className="mt-6 bg-surface border-2 border-border shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <h3 className="text-xl font-bold text-black dark:text-white">{t('settings.appearance')}</h3>
            </CardHeader>
            <Divider className="h-[2px] bg-border" />
            <CardBody className="gap-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-black dark:text-white">{t('settings.theme')}</h4>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {theme === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
                  </p>
                </div>
                <Switch
                  isSelected={theme === 'dark'}
                  onValueChange={toggleTheme}
                  size="lg"
                  color="primary"
                />
              </div>
              
              <div className="pt-4">
                <LanguageDropdown />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="preferences" title={t('settings.preferences')}>
          <Card className="mt-6 bg-surface border-2 border-border shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <h3 className="text-xl font-bold text-black dark:text-white">{t('settings.preferences')}</h3>
            </CardHeader>
            <Divider className="h-[2px] bg-border" />
            <CardBody className="pt-4">
              <Form
                className="w-full space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="w-full">
                  <label htmlFor="peer-input" className="block mb-2 text-md font-bold text-black dark:text-white">
                    {t('settings.peer') || 'Peer'}
                  </label>
                  <Input
                    id="peer-input"
                    type="text"
                    name="peer"
                    errorMessage="Please enter a valid peer"
                    placeholder="Enter your Peer"
                    className="w-full"
                    aria-labelledby="peer-label"
                    size="lg"
                    isRequired
                    variant="bordered"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    classNames={{ 
                      inputWrapper: 'bg-surface-hover border-2 border-border',
                      input: 'text-black dark:text-white font-medium'
                    }}
                  />
                </div>
              </Form>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <div className="mt-10 flex justify-end gap-4">
        <Button
          variant="flat"
          color="danger"
          size="lg"
          onPress={handleCancel}
          className="min-w-[120px] font-bold text-md"
        >
          {t('settings.reset')}
        </Button>
        <Button
          color="primary"
          size="lg"
          onPress={handleSave}
          className="min-w-[120px] font-bold text-md"
        >
          {t('settings.save')}
        </Button>
      </div>
    </div>
  )
}
