import {
  addToast,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@heroui/react'
import { PasswordInput } from '@renderer/components/PasswordInput'
import { useTranslation } from 'react-i18next'
import { LuEye } from 'react-icons/lu'
import { useNavigate } from 'react-router'

interface PasswordModalProps {
  walletId: string
}

export const PasswordModal = ({ walletId }: PasswordModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string

    try {
      const walletData = await window.dbAPI.getWalletById(Number(walletId))
      const decrypted = await window.cryptoAPI.decryptPrivateKey(
        walletData.pk,
        password,
        walletData.salt,
      )

      if (!decrypted) {
        addToast({
          title: t('passwordModal.error'),
          description: t('passwordModal.invalidPasswordError'),
          color: 'danger',
        })
        return
      }

      await window.storageAPI.storePrivateKey(walletData.address, decrypted)

      addToast({
        title: t('passwordModal.success'),
        description: t('passwordModal.successMessage'),
        color: 'success',
      })

      navigate(`/wallet/${walletId}`, { viewTransition: true })
      onClose()
    } catch (error) {
      console.error('Error decrypting wallet:', error)
      addToast({
        title: t('passwordModal.error'),
        description: t('passwordModal.errorMessage'),
        color: 'danger',
      })
    }
  }

  return (
    <>
      <Tooltip 
        content={t('passwordModal.viewDetails')} 
        placement="top" 
        classNames={{
          content: "bg-surface-hover dark:bg-surface border border-border text-text-primary dark:text-text-primary px-3 py-2 shadow-md text-sm font-medium break-all max-w-[280px]",
        }}
      >
        <button 
          onClick={onOpen}
          className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
        >
          <LuEye size={20} className="text-primary" />
        </button>
      </Tooltip>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        hideCloseButton
        classNames={{ 
          wrapper: 'overflow-hidden',
          base: 'border-2 border-border dark:border-border bg-background dark:bg-background shadow-lg'
        }}
      >
        <ModalContent>
          <div className="space-y-8 px-6 py-6 sm:px-10 sm:py-8">
            <ModalHeader className="block space-y-3 text-center px-4">
              <h3 className="text-2xl font-bold text-text-primary">{t('passwordModal.title')}</h3>
            </ModalHeader>

            <ModalBody>
              <Form
                onSubmit={onSubmit}
                id="password-modal"
                className="space-y-6"
              >
                <PasswordInput
                  name="password"
                  errorMessage={t('passwordModal.invalidPassword')}
                  labelPlacement="outside"
                  label={t('common.password')}
                  placeholder={t('passwordModal.passwordPlaceholder')}
                  isRequired
                  size="lg"
                  variant="bordered"
                  autoFocus
                  classNames={{ 
                    inputWrapper: 'bg-surface dark:bg-surface border-2 border-border',
                    input: 'text-text-primary dark:text-text-primary',
                    label: 'text-text-primary dark:text-text-primary font-medium'
                  }}
                />
              </Form>
            </ModalBody>

            <ModalFooter className="flex gap-3 pt-2">
              <Button
                color="danger"
                variant="flat"
                onPress={onClose}
                fullWidth
                radius="sm"
                className="text-danger hover:bg-danger/10 font-medium"
              >
                {t('passwordModal.cancel')}
              </Button>
              <Button
                color="primary"
                type="submit"
                form="password-modal"
                fullWidth
                radius="sm"
                className="bg-primary hover:bg-primary-hover text-white font-medium"
              >
                {t('passwordModal.confirm')}
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
