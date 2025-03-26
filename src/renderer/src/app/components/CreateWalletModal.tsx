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
import { useState, type FC } from 'react'
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

export const CreateWalletModal: FC = () => {
  const { refreshAsync } = useWallet()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [password, setPassword] = useState('')
  const [walletName, setWalletName] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [showMnemonic, { toggle: toggleShowMnemonic }] = useToggle(false)
  const { t } = useTranslation()
  const [continueText] = useState(() => t('common.continue'))

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
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
    } catch {
      addToast({
        title: t('toasts.generateError.title'),
        description: t('toasts.generateError.description'),
        color: 'danger',
      })
    }
  }

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(mnemonic)
    addToast({
      title: t('toasts.copied.title'),
      description: t('toasts.copied.description'),
      color: 'success',
    })
  }

  const finalizeWalletCreation = async (): Promise<void> => {
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
    } catch {
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
        className="px-7"
        startContent={<GoPlus size={20} />}
        variant="shadow"
        color="secondary"
      >
        {t('common.createWallet')}
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        className="bg-default-100"
      >
        <ModalContent>
          <div className="space-y-12 px-12 py-12">
            <ModalHeader className="block space-y-6 text-center">
              <h3 className="text-[28px]">{t('createWallet.title')}</h3>
              <p className="text-lg font-normal text-default-400">
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
                    classNames={{ inputWrapper: 'bg-default-200' }}
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
                    classNames={{ inputWrapper: 'bg-default-200' }}
                  />
                  <PasswordInput
                    name="passwordConfirm"
                    label={t('common.confirmPassword')}
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-default-200' }}
                  />
                </Form>
              </ModalBody>
            ) : (
              <ModalBody>
                <p className="text-center font-bold">
                  {t('createWallet.storeMnemonic')}
                </p>
                <div className="flex items-center gap-3">
                  <Code className="w-[500px] text-wrap break-words text-base">
                    {showMnemonic ? mnemonic : mnemonic.replaceAll(/\w/g, '*')}
                  </Code>
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      color="default"
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={handleCopy}
                    >
                      <MdOutlineContentCopy size={20} />
                    </Button>
                    <Button
                      color="default"
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
                <p className="text-sm font-bold text-warning">
                  {t('common.warning')}
                </p>
              </ModalBody>
            )}

            <ModalFooter>
              {!mnemonic ? (
                <Button
                  color="secondary"
                  type="submit"
                  form="create-wallet-modal"
                  fullWidth
                  radius="sm"
                >
                  {t('common.createWallet')}
                </Button>
              ) : (
                <Button
                  color="default"
                  fullWidth
                  onPress={finalizeWalletCreation}
                >
                  {continueText}
                </Button>
              )}
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
