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
import { LuEye } from 'react-icons/lu'
import { useNavigate } from 'react-router'

interface PasswordModalProps {
  walletId: string
}

export const PasswordModal = ({ walletId }: PasswordModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const navigate = useNavigate()

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
          title: 'Invalid Password',
          description: 'The password you entered is incorrect.',
          color: 'danger',
        })
        return
      }

      await window.storageAPI.storePrivateKey(walletData.address, decrypted)

      addToast({
        title: 'Success',
        description: 'You successfully logged in into your wallet.',
        color: 'success',
      })

      navigate(`/wallet/${walletId}`, { viewTransition: true })
      onClose()
    } catch (error) {
      console.error('Error decrypting wallet:', error)
      addToast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        color: 'danger',
      })
    }
  }

  return (
    <>
      <Tooltip content="View Wallet Details" className="overflow-hidden">
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
              <h3 className="text-[28px]">Enter Wallet Password</h3>
            </ModalHeader>

            <ModalBody>
              <Form
                onSubmit={onSubmit}
                id="password-modal"
                className="space-y-8"
              >
                <PasswordInput
                  name="password"
                  errorMessage="Please enter a valid password"
                  labelPlacement="outside"
                  label="Password"
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
                Cancel
              </Button>
              <Button
                color="secondary"
                type="submit"
                form="password-modal"
                fullWidth
                radius="sm"
              >
                Confirm
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
