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
import { MdOutlineRestoreFromTrash } from 'react-icons/md'
import { useWallet } from '../wallets/WalletContext'

const WALLET_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/

export const RecoverWalletModal = () => {
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
        title: 'Invalid Password',
        description:
          'Password must be at least 8 characters long and contain at least one letter and one number',
        color: 'danger',
      })
      return
    }

    if (password !== confirmPassword) {
      addToast({
        title: 'Mismatched Passwords',
        description: 'Passwords do not match',
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
        title: 'Success',
        description: 'Wallet successfully recovered',
        color: 'success',
      })

      await refreshAsync()
      onClose()
    } catch (error: any) {
      if (error?.message?.includes('UNIQUE constraint failed')) {
        addToast({
          title: 'Duplicate Wallet',
          description: 'This wallet is already added',
          color: 'warning',
        })
      } else {
        addToast({
          title: 'Error',
          description: 'An error occurred while recovering wallet',
          color: 'danger',
        })
      }
    }
  }

  const validatePassword = (value: string) => {
    return !WALLET_PASSWORD_REGEX.test(value)
      ? 'Password must be at least 8 characters long and contain at least one letter and one number'
      : undefined
  }

  const validateConfirmPassword = (value: string) => {
    return value !== password ? 'Passwords do not match' : undefined
  }

  return (
    <>
      <Button 
        onPress={onOpen} 
        className="bg-secondary hover:bg-opacity-80 text-text-primary rounded-lg px-6 py-2 transition-all duration-300 flex items-center gap-2"
        startContent={<MdOutlineRestoreFromTrash size={20} />}
      >
        恢复钱包
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
              <h3 className="text-[28px] text-text-primary">恢复钱包</h3>
              <p className="text-lg font-normal text-text-tertiary">
                恢复一个钱包来管理您的WART代币
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
                  errorMessage="Please enter a valid wallet name"
                  labelPlacement="outside"
                  label="Wallet Name"
                  isRequired
                  size="lg"
                  autoFocus
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-surface-hover' }}
                />
                <Input
                  name="mnemonic"
                  type="text"
                  errorMessage="请输入有效的助记词"
                  labelPlacement="outside"
                  label="助记词"
                  isRequired
                  size="lg"
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-surface-hover' }}
                />
                <PasswordInput
                  name="password"
                  errorMessage="请输入有效的密码"
                  labelPlacement="outside"
                  label="密码"
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
                  label="确认密码"
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
                恢复钱包
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
