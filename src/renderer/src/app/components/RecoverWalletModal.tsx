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
      <Button onPress={onOpen} className="bg-[#27292B] px-9">
        Recover Wallet
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
              <h3 className="text-[28px]">Recover Wallet</h3>
              <p className="text-lg font-normal text-default-400">
                Recover a wallet to manage your WART tokens
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
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <Input
                  name="mnemonic"
                  type="text"
                  errorMessage="Please enter a valid mnemonic"
                  labelPlacement="outside"
                  label="Mnemonic"
                  isRequired
                  size="lg"
                  variant="faded"
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <PasswordInput
                  name="password"
                  errorMessage="Please enter a valid password"
                  labelPlacement="outside"
                  label="Password"
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
                  label="Confirm Password"
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
                Recover Wallet
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
