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
        title: 'Mismatched Passwords',
        description: 'Passwords do not match',
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
        title: 'Error',
        description: 'Failed to generate mnemonic',
        color: 'danger',
      })
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mnemonic)
    addToast({
      title: 'Copied',
      description: 'Mnemonic copied to clipboard',
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
        title: 'Wallet Created',
        description: 'Your wallet has been created successfully',
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
        title: 'Error',
        description: 'Failed to create wallet',
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
        创建钱包
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
              <h3 className="text-[28px] text-text-primary">创建钱包</h3>
              <p className="text-lg font-normal text-text-tertiary">
                创建一个新钱包来管理您的WART代币
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
                    label="钱包名称"
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    autoFocus
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-surface-hover' }}
                  />
                  <PasswordInput
                    name="password"
                    label="密码"
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    validate={(value) =>
                      !WALLET_PASSWORD_REGEX.test(value)
                        ? '密码格式无效'
                        : undefined
                    }
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-surface-hover' }}
                  />
                  <PasswordInput
                    name="passwordConfirm"
                    label="确认密码"
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
                  请安全保管您的助记词:
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
                  警告: 丢失这些单词，就会丢失您的钱包。请安全保存!
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
                  创建钱包
                </Button>
              ) : (
                <Button
                  className="bg-accent hover:bg-opacity-80 text-white"
                  fullWidth
                  onPress={finalizeWalletCreation}
                >
                  继续
                </Button>
              )}
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
