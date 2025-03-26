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
import { useState, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useWallet } from '../wallets/WalletContext'

const WALLET_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/

export const RecoverWalletModal: FC = () => {
  const { refreshAsync } = useWallet()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [password, setPassword] = useState('')
  const { t } = useTranslation()

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
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
    } catch (error) {
      if (
        error instanceof Error &&
        error?.message?.includes('UNIQUE constraint failed')
      ) {
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

  const validatePassword = (value: string): string | undefined => {
    return !WALLET_PASSWORD_REGEX.test(value)
      ? t('recoverWallet.errorPassword')
      : undefined
  }

  const validateConfirmPassword = (value: string): string | undefined => {
    return value !== password
      ? t('toasts.passwordMismatch.description')
      : undefined
  }

  return (
    <>
      <Button onPress={onOpen} className="bg-[#27292B] px-9">
        {t('common.recoverWallet')}
      </Button>

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
              <h3 className="text-[28px]">{t('recoverWallet.title')}</h3>
              <p className="text-lg font-normal text-default-400">
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
                  classNames={{ inputWrapper: 'bg-default-200' }}
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
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <PasswordInput
                  name="password"
                  errorMessage={t('recoverWallet.errorPassword')}
                  labelPlacement="outside"
                  label={t('common.password')}
                  isRequired
                  size="lg"
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-default-200' }}
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
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
              </Form>
            </ModalBody>

            <ModalFooter>
              <Button
                color="secondary"
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
