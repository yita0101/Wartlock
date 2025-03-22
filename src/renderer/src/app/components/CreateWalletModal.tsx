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
        className="px-7"
        startContent={<GoPlus size={20} />}
        style={{
          backgroundImage:
            'linear-gradient(176.63deg, #725DFD -33.88%, #3E3384 111.03%)',
        }}
      >
        Create Wallet
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
              <h3 className="text-[28px]">Create Wallet</h3>
              <p className="text-lg font-normal text-default-400">
                Create a new wallet to manage your WART tokens
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
                    label="Wallet Name"
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    autoFocus
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-default-200' }}
                  />
                  <PasswordInput
                    name="password"
                    label="Password"
                    labelPlacement="outside"
                    isRequired
                    size="lg"
                    validate={(value) =>
                      !WALLET_PASSWORD_REGEX.test(value)
                        ? 'Invalid password format'
                        : undefined
                    }
                    variant="faded"
                    classNames={{ inputWrapper: 'bg-default-200' }}
                  />
                  <PasswordInput
                    name="passwordConfirm"
                    label="Confirm Password"
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
                  Store your mnemonic safely:
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
                  Warning: Lose these words, lose your wallet. Store them
                  safely!
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
                  Create Wallet
                </Button>
              ) : (
                <Button
                  color="default"
                  fullWidth
                  onPress={finalizeWalletCreation}
                >
                  Continue
                </Button>
              )}
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
