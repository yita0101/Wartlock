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
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LuEye } from 'react-icons/lu'
import { useNavigate } from 'react-router'

interface PasswordModalProps {
  walletId: string
}

export const PasswordModal: FC<PasswordModalProps> = ({ walletId }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
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
        className="overflow-hidden"
      >
        <button onClick={onOpen}>
          <LuEye size={20} />
        </button>
      </Tooltip>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        hideCloseButton
        classNames={{ wrapper: 'overflow-hidden' }}
        className="bg-default-100"
      >
        <ModalContent>
          <div className="space-y-12 px-12 py-12">
            <ModalHeader className="block space-y-6 text-center">
              <h3 className="text-[28px]">{t('passwordModal.title')}</h3>
            </ModalHeader>

            <ModalBody>
              <Form
                onSubmit={onSubmit}
                id="password-modal"
                className="space-y-8"
              >
                <PasswordInput
                  name="password"
                  errorMessage={t('passwordModal.invalidPassword')}
                  labelPlacement="outside"
                  label={t('common.password')}
                  isRequired
                  size="lg"
                  variant="faded"
                  autoFocus
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
              </Form>
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                fullWidth
                radius="sm"
              >
                {t('passwordModal.cancel')}
              </Button>
              <Button
                color="secondary"
                type="submit"
                form="password-modal"
                fullWidth
                radius="sm"
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
