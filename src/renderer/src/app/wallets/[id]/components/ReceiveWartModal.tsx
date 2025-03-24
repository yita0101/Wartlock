import {
  addToast,
  Button,
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { GoPlus } from 'react-icons/go'
import { LuCopy } from 'react-icons/lu'

type ReceiveWartModalProps = {
  address: string | undefined
}

export const ReceiveWartModal = ({ address }: ReceiveWartModalProps) => {
  const { t } = useTranslation()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const handleCopy = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    addToast({
      title: t('walletDetails.copied'),
      description: t('walletDetails.addressCopied', 'Address copied to clipboard'),
      color: 'success',
      timeout: 1500,
    })
  }

  return (
    <>
      <Button
        onPress={onOpen}
        className="px-4 py-2 font-medium rounded-md"
        startContent={<GoPlus size={18} />}
        color="success"
        variant="shadow"
      >
        {t('walletDetails.receiveWART')}
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        classNames={{
          base: "rounded-lg border border-border dark:border-border shadow-lg"
        }}
        className="bg-background dark:bg-background"
      >
        <ModalContent>
          <div className="space-y-8 px-8 py-8">
            <ModalHeader className="block space-y-4 text-center px-0">
              <h3 className="text-2xl font-medium text-text-primary dark:text-text-primary">
                {t('walletDetails.receiveWART')}
              </h3>
              <p className="text-base font-normal text-text-tertiary dark:text-text-tertiary">
                {t('walletDetails.receiveDescription', 'Receive WART tokens to your wallet')}
              </p>
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-text-secondary dark:text-text-secondary">
                  {t('walletDetails.yourAddress', 'Your wallet address')}:
                </p>
                <div className="flex items-center p-4 bg-surface dark:bg-surface rounded-lg border border-border dark:border-border">
                  <Code className="w-full text-wrap break-all text-sm bg-transparent text-text-primary dark:text-text-primary">
                    {address}
                  </Code>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-between mt-4">
              <Button 
                color="danger" 
                variant="flat" 
                onPress={onClose}
                className="flex-1 mr-2"
              >
                {t('passwordModal.cancel')}
              </Button>
              <Button 
                color="primary" 
                onPress={handleCopy}
                className="flex-1 ml-2"
                startContent={<LuCopy size={16} />}
              >
                {t('walletDetails.copy', 'Copy Address')}
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
