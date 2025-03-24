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
  const [peerValue, setPeerValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchPeer = async () => {
      const fetchedPeer = await window.dbAPI.getPeer()
      if (isMounted) {
        setPeerValue(fetchedPeer)
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
        <h1 className="text-3xl font-bold text-text-primary">{t('settings.title')}</h1>
        <p className="mt-2 text-text-tertiary">{t('settings.subtitle')}</p>
      </div>

      <Tabs 
        aria-label="Settings tabs" 
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative p-0 border-b border-border",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-2 h-12 text-md",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >
        <Tab key="appearance" title={t('settings.appearance')} className="p-1">
          <Card className="mt-6 bg-surface border-border shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold text-text-primary">{t('settings.appearance')}</h3>
            </CardHeader>
            <Divider className="bg-border" />
            <CardBody className="gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-text-primary">{t('settings.theme')}</h4>
                  <p className="text-sm text-text-tertiary">
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
              
              <div className="pt-2">
                <LanguageDropdown />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="preferences" title={t('settings.preferences')}>
          <Card className="mt-6 bg-surface border-border shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold text-text-primary">{t('settings.preferences')}</h3>
            </CardHeader>
            <Divider className="bg-border" />
            <CardBody>
              <Form
                className="w-full space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  type="text"
                  name="peer"
                  errorMessage="Please enter a valid peer"
                  placeholder="Enter your Peer"
                  className="w-full"
                  labelPlacement="outside"
                  label={t('settings.peer')}
                  size="lg"
                  isRequired
                  variant="bordered"
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  classNames={{ 
                    inputWrapper: 'bg-surface-hover border-border' 
                  }}
                />
              </Form>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <div className="mt-8 flex justify-end gap-4">
        <Button
          variant="flat"
          color="danger"
          size="lg"
          onPress={handleCancel}
          className="min-w-[120px]"
        >
          {t('settings.reset')}
        </Button>
        <Button
          color="primary"
          size="lg"
          onPress={handleSave}
          className="min-w-[120px]"
        >
          {t('settings.save')}
        </Button>
      </div>
    </div>
  )
}
