import {
  addToast,
  Button,
  Code,
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
import { useToggle } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoPlus } from 'react-icons/go'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'
import { MdOutlineContentCopy } from 'react-icons/md'
import { useWallet } from '../wallets/WalletContext'

const WALLET_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/

type CreateWalletData = {
  name: string
  password: string
  passwordConfirm: string
}

export const CreateWalletModal = () => {
  const { t } = useTranslation()
  const { refreshAsync } = useWallet()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [password, setPassword] = useState('')
  const [walletName, setWalletName] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [showMnemonic, { toggle: toggleShowMnemonic }] = useToggle(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.currentTarget))
    const { name, password, passwordConfirm } = formData as CreateWalletData

    if (password !== passwordConfirm) {
      addToast({
        title: t('toasts.passwordMismatch.title'),
        description: t('toasts.passwordMismatch.description'),
        color: 'danger',
      })
      return
    }

    try {
      const generatedMnemonic = await window.mnemoAPI.generateMnemonic()
      setMnemonic(generatedMnemonic)
      setWalletName(name)
      setPassword(password)
    } catch (error) {
      addToast({
        title: t('toasts.generateError.title'),
        description: t('toasts.generateError.description'),
        color: 'danger',
      })
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mnemonic)
    addToast({
      title: t('toasts.copied.title'),
      description: t('toasts.copied.description'),
      color: 'success',
    })
  }

  const finalizeWalletCreation = async () => {
    try {
      const { address, privateKey } =
        await window.walletAPI.walletFromSeed(mnemonic)
      const { encrypted, salt } = await window.cryptoAPI.encryptPrivateKey(
        privateKey,
        password,
      )
      await window.dbAPI.insertWallet(walletName, address, encrypted, salt)

      addToast({
        title: t('toasts.walletCreated.title'),
        description: t('toasts.walletCreated.description'),
        color: 'success',
      })
      setMnemonic('')
      setWalletName('')
      setPassword('')
      toggleShowMnemonic()
      await refreshAsync()
      onClose()
    } catch (error) {
      addToast({
        title: t('toasts.creationFailed.title'),
        description: t('toasts.creationFailed.description'),
        color: 'danger',
      })
    }
  }

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-primary hover:bg-primary-hover text-white rounded-lg px-6 py-2 transition-all duration-300 flex items-center gap-2"
        startContent={<GoPlus size={20} />}
      >
        {t('common.createWallet')}
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        className="bg-surface"
      >
        <ModalContent>
          <div className="space-y-12 px-12 py-12">
            <ModalHeader className="block space-y-6 text-center">
              <h3 className="text-[28px] text-text-primary">{t('createWallet.title')}</h3>
              <p className="text-lg font-normal text-text-tertiary">
                {t('createWallet.description')}
              </p>
            </ModalHeader>

            {!mnemonic ? (
              <ModalBody>
                <Form
                  onSubmit={onSubmit}
                  id="create-wallet-modal"
                  className="space-y-8"
                >
                  <Input
                    name="name"
                    label={t('common.walletName')}
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    autoFocus
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-surface-hover' }}
                  />
                  <PasswordInput
                    name="password"
                    label={t('common.password')}
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    validate={(value) =>
                      !WALLET_PASSWORD_REGEX.test(value)
                        ? t('createWallet.invalidPassword')
                        : undefined
                    }
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-surface-hover' }}
                  />
                  <PasswordInput
                    name="passwordConfirm"
                    label={t('common.confirmPassword')}
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-surface-hover' }}
                  />
                </Form>
              </ModalBody>
            ) : (
              <ModalBody>
                <p className="text-center font-bold text-text-primary">
                  {t('createWallet.storeMnemonic')}
                </p>
                <div className="flex items-center gap-3">
                  <Code className="w-[500px] text-wrap break-words text-base bg-surface-hover border-border">
                    {showMnemonic ? mnemonic : mnemonic.replaceAll(/\w/g, '*')}
                  </Code>
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      className="text-text-primary"
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={handleCopy}
                    >
                      <MdOutlineContentCopy size={20} />
                    </Button>
                    <Button
                      className="text-text-primary"
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={toggleShowMnemonic}
                    >
                      {showMnemonic ? (
                        <IoIosEyeOff size={20} />
                      ) : (
                        <IoIosEye size={20} />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-bold text-primary">
                  {t('common.warning')}
                </p>
              </ModalBody>
            )}

            <ModalFooter>
              {!mnemonic ? (
                <Button
                  className="bg-primary hover:bg-primary-hover text-white"
                  type="submit"
                  form="create-wallet-modal"
                  fullWidth
                  radius="sm"
                >
                  {t('common.createWallet')}
                </Button>
              ) : (
                <Button
                  className="bg-accent hover:bg-opacity-80 text-white"
                  fullWidth
                  onPress={finalizeWalletCreation}
                >
                  {t('common.continue')}
                </Button>
              )}
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
