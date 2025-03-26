import { addToast, Button, Card, Divider, Form, Input } from '@heroui/react'
import { useEffect, useState, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { LanguageDropdown } from './LanguageDropdown'

export const SettingsForm: FC = () => {
  const [, setPeer] = useState('')
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    let isMounted = true

    const fetchPeer = async (): Promise<void> => {
      const fetchedPeer = await window.dbAPI.getPeer()
      if (isMounted) {
        setPeer(fetchedPeer)
        setInputValue(fetchedPeer)
      }
    }

    fetchPeer()

    return (): void => {
      isMounted = false
    }
  }, [])

  const handleCancel = (): void => {
    navigate('/')
  }

  const handleConfirm = async (): Promise<void> => {
    if (!inputValue.trim()) {
      alert(t('settings.peerRequired'))
      return
    }

    try {
      await window.dbAPI.updatePeer(inputValue)
      addToast({
        title: t('settings.saved'),
        description: t('settings.peerUpdated'),
        color: 'success',
        timeout: 2000,
      })
    } catch {
      addToast({
        title: t('settings.error'),
        description: t('settings.updateFailed'),
        color: 'danger',
        timeout: 2000,
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl border-none bg-default-500 shadow-md dark:bg-default-100">
      <Form
        className="flex flex-col items-center space-y-6 p-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-5">
          <h3 className="text-xl font-bold text-default-200 dark:text-default-800">
            {t('settings.preferences')}
          </h3>

          <Divider className="my-2" />

          <div className="min-w-96 space-y-16 pt-2">
            <LanguageDropdown />

            <Input
              type="text"
              name="peer"
              errorMessage={t('settings.invalidPeer')}
              placeholder={t('settings.enterPeer')}
              labelPlacement="outside"
              label={t('settings.peer')}
              size="lg"
              isRequired
              variant="bordered"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="flat"
            color="danger"
            size="md"
            onPress={handleCancel}
          >
            {t('passwordModal.cancel')}
          </Button>
          <Button
            type="button"
            color="secondary"
            size="md"
            onPress={handleConfirm}
          >
            {t('passwordModal.confirm')}
          </Button>
        </div>
      </Form>
    </Card>
  )
}
