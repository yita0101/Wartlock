import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { PasswordInput } from '@renderer/components/PasswordInput'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdOutlineRestoreFromTrash } from 'react-icons/md'
import { useWallet } from '../wallets/WalletContext'

const WALLET_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/

export const RecoverWalletModal = () => {
  const { t } = useTranslation()
  const { refreshAsync } = useWallet()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
      wallet: string
      mnemonic: string
      password: string
      confirmPassword: string
    }

    const { wallet, mnemonic, password, confirmPassword } = formData

    if (!WALLET_PASSWORD_REGEX.test(password)) {
      addToast({
        title: t('toasts.invalidPassword.title'),
        description: t('toasts.invalidPassword.description'),
        color: 'danger',
      })
      return
    }

    if (password !== confirmPassword) {
      addToast({
        title: t('toasts.passwordMismatch.title'),
        description: t('toasts.passwordMismatch.description'),
        color: 'danger',
      })
      return
    }

    try {
      const { address, privateKey } =
        await window.walletAPI.walletFromSeed(mnemonic)
      const { encrypted, salt } = await window.cryptoAPI.encryptPrivateKey(
        privateKey,
        password,
      )
      await window.dbAPI.insertWallet(wallet, address, encrypted, salt)

      addToast({
        title: t('toasts.walletRecovered.title'),
        description: t('toasts.walletRecovered.description'),
        color: 'success',
      })

      await refreshAsync()
      onClose()
    } catch (error: any) {
      if (error?.message?.includes('UNIQUE constraint failed')) {
        addToast({
          title: t('toasts.duplicateWallet.title'),
          description: t('toasts.duplicateWallet.description'),
          color: 'warning',
        })
      } else {
        addToast({
          title: t('toasts.recoveryError.title'),
          description: t('toasts.recoveryError.description'),
          color: 'danger',
        })
      }
    }
  }

  const validatePassword = (value: string) => {
    return !WALLET_PASSWORD_REGEX.test(value)
      ? t('toasts.invalidPassword.description')
      : undefined
  }

  const validateConfirmPassword = (value: string) => {
    return value !== password ? t('toasts.passwordMismatch.description') : undefined
  }

  return (
    <>
      <Button 
        onPress={onOpen} 
        className="bg-secondary hover:bg-opacity-80 text-text-primary rounded-lg px-6 py-2 transition-all duration-300 flex items-center gap-2"
        startContent={<MdOutlineRestoreFromTrash size={20} />}
      >
        {t('common.recoverWallet')}
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        hideCloseButton
        classNames={{ wrapper: 'overflow-hidden' }}
        className="bg-surface"
      >
        <ModalContent>
          <div className="space-y-12 px-12 py-12">
            <ModalHeader className="block space-y-6 text-center">
              <h3 className="text-[28px] text-text-primary">{t('recoverWallet.title')}</h3>
              <p className="text-lg font-normal text-text-tertiary">
                {t('recoverWallet.description')}
              </p>
            </ModalHeader>

            <ModalBody>
              <Form
                onSubmit={onSubmit}
                id="recover-wallet-modal"
                className="space-y-8"
              >
                <Input
                  name="wallet"
                  type="text"
                  errorMessage={t('recoverWallet.errorWalletName')}
                  labelPlacement="outside"
                  label={t('common.walletName')}
                  isRequired
                  size="lg"
                  autoFocus
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-surface-hover' }}
                />
                <Input
                  name="mnemonic"
                  type="text"
                  errorMessage={t('recoverWallet.errorMnemonic')}
                  labelPlacement="outside"
                  label={t('common.mnemonic')}
                  isRequired
                  size="lg"
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-surface-hover' }}
                />
                <PasswordInput
                  name="password"
                  errorMessage={t('recoverWallet.errorPassword')}
                  labelPlacement="outside"
                  label={t('common.password')}
                  isRequired
                  size="lg"
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-surface-hover' }}
                  onValueChange={setPassword}
                  validate={validatePassword}
                />
                <PasswordInput
                  name="confirmPassword"
                  labelPlacement="outside"
                  label={t('common.confirmPassword')}
                  isRequired
                  size="lg"
                  validate={validateConfirmPassword}
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-surface-hover' }}
                />
              </Form>
            </ModalBody>

            <ModalFooter>
              <Button
                className="bg-primary hover:bg-primary-hover text-white"
                type="submit"
                form="recover-wallet-modal"
                fullWidth
                radius="sm"
              >
                {t('common.recoverWallet')}
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
