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
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { GoPlus } from 'react-icons/go'

type ReceiveWartModalProps = {
  address: string | undefined
}

export const ReceiveWartModal: FC<ReceiveWartModalProps> = ({ address }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { t } = useTranslation()

  const handleCopy = async (): Promise<void> => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    addToast({
      title: t('walletDetails.copied'),
      description: t('walletDetails.addressCopied'),
      color: 'success',
    })
  }

  return (
    <>
      <Button
        onPress={onOpen}
        className="px-7"
        startContent={<GoPlus size={20} />}
        color="default"
        variant="light"
      >
        {t('walletDetails.receiveWART')}
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
              <h3 className="text-[28px]">{t('walletDetails.receiveWART')}</h3>
              <p className="text-lg font-normal text-default-400">
                {t('walletDetails.receiveDescription')}
              </p>
            </ModalHeader>

            <ModalBody>
              <div className="flex items-center gap-3">
                <Code className="w-[500px] text-wrap break-words text-base">
                  {address}
                </Code>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t('passwordModal.cancel')}
              </Button>
              <Button color="default" onPress={handleCopy}>
                {t('walletDetails.copy')}
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
